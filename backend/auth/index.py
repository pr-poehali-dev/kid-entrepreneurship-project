import json
import os
import hashlib
import secrets
import psycopg2

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Регистрация и вход пользователей магазина"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Content-Type': 'application/json'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action')

    conn = get_db()
    cur = conn.cursor()

    try:
        if action == 'register':
            username = body.get('username', '').strip()
            email = body.get('email', '').strip()
            password = body.get('password', '')

            if not username or not email or not password:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все поля'})}

            cur.execute("SELECT id FROM users WHERE email=%s OR username=%s", (email, username))
            if cur.fetchone():
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Пользователь уже существует'})}

            pw_hash = hash_password(password)
            cur.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id, username, email, role",
                        (username, email, pw_hash))
            user = cur.fetchone()
            conn.commit()

            session_id = secrets.token_hex(32)
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
                'success': True,
                'user': {'id': user[0], 'username': user[1], 'email': user[2], 'role': user[3]},
                'session_id': session_id
            })}

        elif action == 'login':
            email = body.get('email', '').strip()
            password = body.get('password', '')
            pw_hash = hash_password(password)

            cur.execute("SELECT id, username, email, role FROM users WHERE email=%s AND password_hash=%s", (email, pw_hash))
            user = cur.fetchone()

            if not user:
                return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Неверный email или пароль'})}

            session_id = secrets.token_hex(32)
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
                'success': True,
                'user': {'id': user[0], 'username': user[1], 'email': user[2], 'role': user[3]},
                'session_id': session_id
            })}

        else:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Неизвестное действие'})}

    finally:
        cur.close()
        conn.close()
