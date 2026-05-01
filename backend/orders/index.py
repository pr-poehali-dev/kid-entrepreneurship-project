import json
import os
import psycopg2

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Создание и получение заказов игровой валюты"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Content-Type': 'application/json'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    conn = get_db()
    cur = conn.cursor()

    try:
        if event.get('httpMethod') == 'POST':
            body = json.loads(event.get('body') or '{}')
            user_id = body.get('user_id')
            product_id = body.get('product_id')
            game_nickname = body.get('game_nickname', '').strip()
            server = body.get('server', '').strip()
            quantity = int(body.get('quantity', 1))

            if not product_id or not game_nickname:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все поля'})}

            cur.execute("SELECT price, pack_name FROM products WHERE id=%s AND in_stock=TRUE", (product_id,))
            product = cur.fetchone()
            if not product:
                return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Товар не найден'})}

            total_price = float(product[0]) * quantity

            cur.execute("""
                INSERT INTO orders (user_id, product_id, game_nickname, server, quantity, total_price, status)
                VALUES (%s, %s, %s, %s, %s, %s, 'pending')
                RETURNING id, status, created_at
            """, (user_id, product_id, game_nickname, server, quantity, total_price))

            order = cur.fetchone()
            conn.commit()

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
                'success': True,
                'order': {
                    'id': order[0],
                    'status': order[1],
                    'total_price': total_price,
                    'pack_name': product[1]
                }
            })}

        elif event.get('httpMethod') == 'GET':
            params = event.get('queryStringParameters') or {}
            user_id = params.get('user_id')
            if not user_id:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'user_id обязателен'})}

            cur.execute("""
                SELECT o.id, p.game_name, p.pack_name, o.game_nickname, o.quantity, o.total_price, o.status, o.created_at
                FROM orders o JOIN products p ON o.product_id = p.id
                WHERE o.user_id=%s ORDER BY o.created_at DESC
            """, (user_id,))

            orders = []
            for r in cur.fetchall():
                orders.append({
                    'id': r[0],
                    'game_name': r[1],
                    'pack_name': r[2],
                    'game_nickname': r[3],
                    'quantity': r[4],
                    'total_price': float(r[5]),
                    'status': r[6],
                    'created_at': str(r[7])
                })

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'orders': orders})}

    finally:
        cur.close()
        conn.close()
