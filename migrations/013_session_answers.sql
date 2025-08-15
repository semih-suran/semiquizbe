CREATE TABLE IF NOT EXISTS session_answers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES sessions(session_id) ON DELETE CASCADE,
  question_id text NOT NULL,
  chosen_option_id text,
  correct boolean,
  response_time_ms int,
  server_ts timestamptz NOT NULL DEFAULT now()
);
