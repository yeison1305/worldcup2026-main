-- src/migrations/003_add_password_reset_fields.sql
-- Agrega campos para reset de contraseña

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(64),
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;

-- Index para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
