-- Tabla de predicciones automáticas
CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL,
  predicted_winner VARCHAR(255),
  home_win_probability DECIMAL(5,2),
  away_win_probability DECIMAL(5,2),
  draw_probability DECIMAL(5,2),
  confidence DECIMAL(5,2),
  reasoning TEXT,
  model_version VARCHAR(50) DEFAULT 'v1-basic-score',
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_prediction_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT uq_prediction_match UNIQUE (match_id)
);

CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
