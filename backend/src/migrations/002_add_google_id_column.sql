-- src/migrations/002_add_google_id_column.sql
-- Agrega columna google_id para login con Google OAuth

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- Index para búsquedas rápidas por google_id
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
