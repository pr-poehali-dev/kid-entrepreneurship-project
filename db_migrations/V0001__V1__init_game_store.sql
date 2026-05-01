
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products (game currency packs)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  game_name VARCHAR(100) NOT NULL,
  pack_name VARCHAR(100) NOT NULL,
  currency_amount INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  currency_icon VARCHAR(10) DEFAULT '💎',
  badge VARCHAR(20),
  description TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  game_nickname VARCHAR(100) NOT NULL,
  server VARCHAR(50),
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  username VARCHAR(50) NOT NULL,
  game_name VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_name VARCHAR(50) DEFAULT 'Гость',
  message TEXT NOT NULL,
  is_support BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert demo products
INSERT INTO products (game_name, pack_name, currency_amount, price, old_price, currency_icon, badge, description, sort_order) VALUES
('Minecraft', 'Стартовый набор', 100, 99, NULL, '💎', NULL, 'Идеально для начала', 1),
('Minecraft', 'Стандартный пакет', 500, 399, 499, '💎', 'ХИИТ', 'Самый популярный выбор', 2),
('Minecraft', 'Премиум пакет', 1500, 999, 1299, '💎', 'ПОПУЛЯРНЫЙ', 'Для настоящих фанатов', 3),
('Minecraft', 'Мега набор', 5000, 2799, 3499, '💎', 'ВЫГОДА', 'Максимальная экономия', 4),
('Roblox', 'Robux Mini', 400, 249, NULL, '🪙', NULL, 'Маленький старт', 5),
('Roblox', 'Robux Standard', 1000, 549, 699, '🪙', 'ХИИТ', 'Популярный выбор', 6),
('Roblox', 'Robux Premium', 2000, 999, 1299, '🪙', 'СКИДКА', 'Отличное соотношение', 7),
('Fortnite', 'V-Bucks Small', 1000, 599, NULL, '⚡', NULL, 'Базовый пакет', 8),
('Fortnite', 'V-Bucks Medium', 2800, 1499, 1799, '⚡', 'ПОПУЛЯРНЫЙ', 'Средний пакет', 9),
('Fortnite', 'V-Bucks Large', 5000, 2399, 2999, '⚡', 'ВЫГОДА', 'Большая экономия', 10);

-- Insert demo reviews
INSERT INTO reviews (username, game_name, rating, comment) VALUES
('ProGamer2024', 'Minecraft', 5, 'Супер быстрая доставка! Заказал и через 5 минут уже играл. Рекомендую!'),
('StarPlayer', 'Roblox', 5, 'Отличный магазин, всё честно и надёжно. Уже третья покупка!'),
('NightWolf88', 'Fortnite', 4, 'Хороший сервис, доставили быстро. Небольшая заминка со связью, но всё решили.'),
('GameQueen', 'Minecraft', 5, 'Лучший магазин для покупки валюты! Цены ниже чем везде, поддержка топ.'),
('SpeedRunner', 'Roblox', 5, 'Сразу после оплаты получил валюту. Очень доволен!'),
('DarkKnight', 'Fortnite', 5, 'Пользуюсь уже полгода, ни разу не подвели. Всем советую!');
