-- src/migrations/001_add_email_unique_constraint.sql
-- Agrega constraint UNIQUE al email para prevenir race conditions

-- Si la tabla ya existe y tiene datos duplicados, esto fallará
-- Ejecutar primero: DELETE FROM users WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email);

ALTER TABLE users 
ADD CONSTRAINT users_email_unique UNIQUE (email);
