CREATE TABLE IF NOT EXISTS sessions (
  session_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  country_code varchar(8) NOT NULL,
  question_index int NOT NULL DEFAULT 0,
  correct_count int NOT NULL DEFAULT 0,
  elapsed_ms bigint NOT NULL DEFAULT 0,
  question_ids jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('active','paused','completed','failed')),
  start_ts timestamptz NOT NULL DEFAULT now(),
  last_heartbeat timestamptz NOT NULL DEFAULT now(),
  paused_at timestamptz,
  total_test_time_ms bigint NOT NULL DEFAULT 600000
);
