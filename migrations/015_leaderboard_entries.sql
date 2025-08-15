CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  display_name text,
  avatar_url text,
  country_code varchar(8),
  score int NOT NULL,
  achieved_at timestamptz NOT NULL DEFAULT now(),
  completed_test_id uuid REFERENCES completed_tests(id)
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_country_score ON leaderboard_entries (country_code, score DESC, achieved_at ASC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard_entries (score DESC, achieved_at ASC);
