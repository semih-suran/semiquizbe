CREATE TABLE IF NOT EXISTS completed_tests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES sessions(session_id),
  user_id uuid REFERENCES users(id),
  country_code varchar(8),
  correct_count int,
  elapsed_ms bigint,
  score_raw double precision,
  score_rounded int,
  achieved_at timestamptz NOT NULL DEFAULT now()
);
