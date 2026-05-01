import json
import os
import psycopg2

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Каталог товаров (игровая валюта)"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    params = event.get('queryStringParameters') or {}
    game_filter = params.get('game', '')

    conn = get_db()
    cur = conn.cursor()

    try:
        if game_filter:
            cur.execute("""
                SELECT id, game_name, pack_name, currency_amount, price, old_price, 
                       currency_icon, badge, description, in_stock
                FROM products WHERE in_stock=TRUE AND game_name=%s
                ORDER BY sort_order
            """, (game_filter,))
        else:
            cur.execute("""
                SELECT id, game_name, pack_name, currency_amount, price, old_price,
                       currency_icon, badge, description, in_stock
                FROM products WHERE in_stock=TRUE
                ORDER BY sort_order
            """)

        rows = cur.fetchall()
        products = []
        for r in rows:
            discount = None
            if r[5]:
                discount = round((1 - float(r[4]) / float(r[5])) * 100)
            products.append({
                'id': r[0],
                'game_name': r[1],
                'pack_name': r[2],
                'currency_amount': r[3],
                'price': float(r[4]),
                'old_price': float(r[5]) if r[5] else None,
                'discount': discount,
                'currency_icon': r[6],
                'badge': r[7],
                'description': r[8],
                'in_stock': r[9]
            })

        # Get distinct games
        cur.execute("SELECT DISTINCT game_name FROM products WHERE in_stock=TRUE ORDER BY game_name")
        games = [row[0] for row in cur.fetchall()]

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'products': products, 'games': games})}

    finally:
        cur.close()
        conn.close()
