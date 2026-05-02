CREATE TABLE IF NOT EXISTS bs_listings (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  trophies INTEGER NOT NULL DEFAULT 0,
  brawlers_count INTEGER NOT NULL DEFAULT 0,
  max_brawler_trophies INTEGER DEFAULT 0,
  has_legendary BOOLEAN DEFAULT FALSE,
  has_mythic BOOLEAN DEFAULT FALSE,
  server VARCHAR(20) DEFAULT 'global',
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  account_email VARCHAR(200),
  account_password VARCHAR(200),
  account_login_method VARCHAR(50) DEFAULT 'supercell_id',
  rare_brawlers TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bs_purchases (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES bs_listings(id),
  buyer_id INTEGER REFERENCES users(id),
  price DECIMAL(10,2) NOT NULL,
  purchased_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO bs_listings (seller_id, title, trophies, brawlers_count, max_brawler_trophies, has_legendary, has_mythic, price, description, account_email, account_password, account_login_method, rare_brawlers, status)
VALUES
(1, 'Топ аккаунт 45000 кубков', 45000, 58, 1200, TRUE, TRUE, 2999, 'Прокачанный аккаунт с Сэнди, Эмбер и Кроу. Все легендарные бойцы. Активен 2 года.', 'demo1@example.com', 'demopass1', 'supercell_id', 'Sandy, Amber, Crow, Leon, Spike', 'active'),
(1, 'Средний аккаунт 18000 кубков', 18000, 32, 800, FALSE, TRUE, 899, 'Хороший аккаунт для старта. Есть Сэм, Ларри и Лоуи. Без блокировок.', 'demo2@example.com', 'demopass2', 'supercell_id', 'Sam, Larry & Lawrie, Maisie', 'active'),
(1, 'Старт 8000 кубков', 8000, 18, 500, FALSE, FALSE, 399, 'Бюджетный аккаунт. Хорошая база для прокачки.', 'demo3@example.com', 'demopass3', 'supercell_id', 'Buzz, Ash, Eve', 'active'),
(1, 'Мега аккаунт 72000 кубков', 72000, 68, 1650, TRUE, TRUE, 5499, 'Максимально прокачанный аккаунт. Все легендарки, много хромов. Топ в рейтинге.', 'demo4@example.com', 'demopass4', 'supercell_id', 'Sandy, Amber, Crow, Leon, Spike, Draco, Meeple', 'active'),
(1, 'Быстрый старт 3000 кубков', 3000, 10, 350, FALSE, FALSE, 149, 'Свежий аккаунт с хорошей базой бойцов для начала игры.', 'demo5@example.com', 'demopass5', 'supercell_id', 'Bea, Grom, Bonnie', 'active');
