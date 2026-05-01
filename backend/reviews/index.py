import json
import os
import psycopg2

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Отзывы покупателей"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    conn = get_db()
    cur = conn.cursor()

    try:
        if event.get('httpMethod') == 'GET':
            cur.execute("""
                SELECT id, username, game_name, rating, comment, created_at
                FROM reviews WHERE is_approved=TRUE
                ORDER BY created_at DESC LIMIT 20
            """)
            reviews = []
            for r in cur.fetchall():
                reviews.append({
                    'id': r[0],
                    'username': r[1],
                    'game_name': r[2],
                    'rating': r[3],
                    'comment': r[4],
                    'created_at': str(r[5])
                })

            cur.execute("SELECT AVG(rating), COUNT(*) FROM reviews WHERE is_approved=TRUE")
            stats = cur.fetchone()
            avg_rating = round(float(stats[0]), 1) if stats[0] else 5.0
            total = stats[1] or 0

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
                'reviews': reviews,
                'avg_rating': avg_rating,
                'total': total
            })}

        elif event.get('httpMethod') == 'POST':
            body = json.loads(event.get('body') or '{}')
            username = body.get('username', '').strip()
            game_name = body.get('game_name', '').strip()
            rating = int(body.get('rating', 5))
            comment = body.get('comment', '').strip()

            if not username or not comment or rating < 1 or rating > 5:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все поля'})}

            cur.execute("""
                INSERT INTO reviews (username, game_name, rating, comment)
                VALUES (%s, %s, %s, %s) RETURNING id
            """, (username, game_name, rating, comment))
            review_id = cur.fetchone()[0]
            conn.commit()

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True, 'id': review_id})}

    finally:
        cur.close()
        conn.close()
