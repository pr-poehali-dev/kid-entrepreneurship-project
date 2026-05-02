import json
import os
import psycopg2

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
}

def ok(data):
    return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, code=400):
    return {'statusCode': code, 'headers': HEADERS, 'body': json.dumps({'error': msg}, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    """API для маркетплейса аккаунтов Brawl Stars: объявления и покупки"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'listings')

    conn = get_db()
    cur = conn.cursor()

    try:
        # --- LISTINGS ---
        if action == 'listings' and method == 'GET':
            filters, values = [], []
            if params.get('has_legendary') == 'true':
                filters.append('l.has_legendary = TRUE')
            if params.get('has_mythic') == 'true':
                filters.append('l.has_mythic = TRUE')
            if params.get('min_trophies'):
                filters.append('l.trophies >= %s')
                values.append(int(params['min_trophies']))
            if params.get('max_price'):
                filters.append('l.price <= %s')
                values.append(float(params['max_price']))

            where = "WHERE l.status = 'active'"
            if filters:
                where += ' AND ' + ' AND '.join(filters)

            order_map = {'price_asc': 'l.price ASC', 'price_desc': 'l.price DESC', 'trophies': 'l.trophies DESC'}
            order = order_map.get(params.get('sort', ''), 'l.created_at DESC')

            cur.execute(f"""
                SELECT l.id, l.title, l.trophies, l.brawlers_count, l.max_brawler_trophies,
                       l.has_legendary, l.has_mythic, l.server, l.price, l.description,
                       l.rare_brawlers, l.status, l.created_at, u.username
                FROM bs_listings l JOIN users u ON l.seller_id = u.id
                {where} ORDER BY {order} LIMIT 50
            """, values)

            cols = ['id','title','trophies','brawlers_count','max_brawler_trophies',
                    'has_legendary','has_mythic','server','price','description',
                    'rare_brawlers','status','created_at','seller_name']
            listings = []
            for r in cur.fetchall():
                d = dict(zip(cols, r))
                d['price'] = float(d['price'])
                listings.append(d)
            return ok({'listings': listings})

        # --- LISTING DETAIL ---
        elif action == 'detail' and method == 'GET':
            listing_id = params.get('id')
            if not listing_id:
                return err('id обязателен')
            cur.execute("""
                SELECT l.id, l.title, l.trophies, l.brawlers_count, l.max_brawler_trophies,
                       l.has_legendary, l.has_mythic, l.server, l.price, l.description,
                       l.rare_brawlers, l.status, l.created_at, l.account_login_method,
                       u.username, u.id
                FROM bs_listings l JOIN users u ON l.seller_id = u.id
                WHERE l.id = %s
            """, (int(listing_id),))
            r = cur.fetchone()
            if not r:
                return err('Объявление не найдено', 404)
            cols = ['id','title','trophies','brawlers_count','max_brawler_trophies',
                    'has_legendary','has_mythic','server','price','description',
                    'rare_brawlers','status','created_at','account_login_method',
                    'seller_name','seller_id']
            d = dict(zip(cols, r))
            d['price'] = float(d['price'])
            return ok(d)

        # --- CREATE LISTING ---
        elif action == 'create' and method == 'POST':
            body = json.loads(event.get('body') or '{}')
            required = ['seller_id','title','price','trophies','brawlers_count','account_email','account_password']
            if not all(body.get(k) for k in required):
                return err('Заполните все обязательные поля')

            cur.execute("""
                INSERT INTO bs_listings
                  (seller_id, title, trophies, brawlers_count, max_brawler_trophies,
                   has_legendary, has_mythic, server, price, description,
                   account_email, account_password, account_login_method, rare_brawlers)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id
            """, (
                body['seller_id'], body['title'], body['trophies'], body['brawlers_count'],
                body.get('max_brawler_trophies', 0), body.get('has_legendary', False),
                body.get('has_mythic', False), body.get('server', 'global'),
                body['price'], body.get('description', ''),
                body['account_email'], body['account_password'],
                body.get('account_login_method', 'supercell_id'), body.get('rare_brawlers', '')
            ))
            new_id = cur.fetchone()[0]
            conn.commit()
            return ok({'success': True, 'id': new_id})

        # --- BUY ---
        elif action == 'buy' and method == 'POST':
            body = json.loads(event.get('body') or '{}')
            listing_id = body.get('listing_id')
            buyer_id = body.get('buyer_id')
            if not listing_id or not buyer_id:
                return err('listing_id и buyer_id обязательны')

            cur.execute("""
                SELECT id, price, account_email, account_password, account_login_method,
                       seller_id, title, status
                FROM bs_listings WHERE id = %s
            """, (listing_id,))
            listing = cur.fetchone()
            if not listing:
                return err('Объявление не найдено', 404)
            if listing[7] != 'active':
                return err('Этот аккаунт уже продан')
            if listing[5] == buyer_id:
                return err('Нельзя купить свой аккаунт')

            # Уже куплен?
            cur.execute("SELECT id FROM bs_purchases WHERE listing_id=%s AND buyer_id=%s", (listing_id, buyer_id))
            if cur.fetchone():
                return ok({'success': True, 'already': True, 'account': {
                    'email': listing[2], 'password': listing[3],
                    'login_method': listing[4], 'title': listing[6]
                }})

            cur.execute("INSERT INTO bs_purchases (listing_id, buyer_id, price) VALUES (%s,%s,%s) RETURNING id",
                        (listing_id, buyer_id, float(listing[1])))
            purchase_id = cur.fetchone()[0]
            cur.execute("UPDATE bs_listings SET status='sold' WHERE id=%s", (listing_id,))
            conn.commit()
            return ok({'success': True, 'purchase_id': purchase_id, 'account': {
                'email': listing[2], 'password': listing[3],
                'login_method': listing[4], 'title': listing[6]
            }})

        # --- MY LISTINGS (seller dashboard) ---
        elif action == 'my_listings' and method == 'GET':
            seller_id = params.get('seller_id')
            if not seller_id:
                return err('seller_id обязателен')
            cur.execute("""
                SELECT id, title, trophies, brawlers_count, price,
                       status, created_at, account_email, account_password, account_login_method
                FROM bs_listings WHERE seller_id=%s ORDER BY created_at DESC
            """, (int(seller_id),))
            cols = ['id','title','trophies','brawlers_count','price','status',
                    'created_at','account_email','account_password','account_login_method']
            listings = []
            for r in cur.fetchall():
                d = dict(zip(cols, r))
                d['price'] = float(d['price'])
                listings.append(d)
            return ok({'listings': listings})

        # --- MY PURCHASES (buyer) ---
        elif action == 'my_purchases' and method == 'GET':
            buyer_id = params.get('buyer_id')
            if not buyer_id:
                return err('buyer_id обязателен')
            cur.execute("""
                SELECT p.id, l.title, l.trophies, l.brawlers_count,
                       l.account_email, l.account_password, l.account_login_method,
                       p.price, p.purchased_at
                FROM bs_purchases p JOIN bs_listings l ON p.listing_id = l.id
                WHERE p.buyer_id=%s ORDER BY p.purchased_at DESC
            """, (int(buyer_id),))
            cols = ['purchase_id','title','trophies','brawlers_count',
                    'account_email','account_password','account_login_method','price','purchased_at']
            purchases = [dict(zip(cols, r)) for r in cur.fetchall()]
            for p in purchases:
                p['price'] = float(p['price'])
            return ok({'purchases': purchases})

        else:
            return err('Неизвестный action')

    finally:
        cur.close()
        conn.close()
