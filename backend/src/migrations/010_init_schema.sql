-- Tabla de usuarios para World Cup 2026 Predictor
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER',
  google_id VARCHAR(255) UNIQUE,
  reset_token VARCHAR(64),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  group_letter CHAR(1) NOT NULL CHECK (group_letter BETWEEN 'A' AND 'H'),
  flag_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Verificar que todo se creó
SELECT 'Users table ready' as status FROM users LIMIT 1
UNION ALL
SELECT 'Teams table ready' as status FROM teams LIMIT 1;