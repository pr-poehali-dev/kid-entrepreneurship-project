import json
import os
import psycopg2

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Чат поддержки для помощи покупателям"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
        'Content-Type': 'application/json'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    conn = get_db()
    cur = conn.cursor()

    try:
        if event.get('httpMethod') == 'POST':
            body = json.loads(event.get('body') or '{}')
            session_id = body.get('session_id', 'anon')
            user_name = body.get('user_name', 'Гость')
            message = body.get('message', '').strip()

            if not message:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Сообщение пустое'})}

            cur.execute("""
                INSERT INTO chat_messages (session_id, user_name, message, is_support)
                VALUES (%s, %s, %s, FALSE) RETURNING id, created_at
            """, (session_id, user_name, message))
            msg = cur.fetchone()

            auto_reply = None
            msg_lower = message.lower()
            if any(w in msg_lower for w in ['привет', 'здравствуй', 'добрый', 'hello', 'hi']):
                auto_reply = 'Привет! Рады вас видеть в GameCoin Shop! Чем можем помочь? 😊'
            elif any(w in msg_lower for w in ['цена', 'стоим', 'сколько', 'price']):
                auto_reply = 'Все актуальные цены вы можете посмотреть в нашем Каталоге. Если нужна помощь с выбором — спрашивайте!'
            elif any(w in msg_lower for w in ['доставк', 'быстро', 'когда', 'получ']):
                auto_reply = 'Доставка игровой валюты происходит в течение 5-15 минут после оплаты. Работаем круглосуточно!'
            elif any(w in msg_lower for w in ['оплат', 'платёж', 'payment']):
                auto_reply = 'Принимаем оплату картой, СБП и электронными кошельками. Все транзакции защищены.'
            elif any(w in msg_lower for w in ['возврат', 'refund', 'вернуть']):
                auto_reply = 'По вопросам возврата обратитесь к нам через email support@gamecoin.shop. Рассмотрим в течение 24 часов.'
            else:
                auto_reply = 'Спасибо за обращение! Оператор ответит вам в ближайшее время. Обычно это занимает до 15 минут.'

            if auto_reply:
                cur.execute("""
                    INSERT INTO chat_messages (session_id, user_name, message, is_support)
                    VALUES (%s, 'Поддержка', %s, TRUE)
                """, (session_id, auto_reply))

            conn.commit()

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
                'success': True,
                'id': msg[0],
                'auto_reply': auto_reply
            })}

        elif event.get('httpMethod') == 'GET':
            params = event.get('queryStringParameters') or {}
            session_id = params.get('session_id', 'anon')

            cur.execute("""
                SELECT id, user_name, message, is_support, created_at
                FROM chat_messages WHERE session_id=%s
                ORDER BY created_at ASC LIMIT 50
            """, (session_id,))

            messages = []
            for r in cur.fetchall():
                messages.append({
                    'id': r[0],
                    'user_name': r[1],
                    'message': r[2],
                    'is_support': r[3],
                    'created_at': str(r[4])
                })

            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'messages': messages})}

    finally:
        cur.close()
        conn.close()
