CREATE TABLE IF NOT EXISTS shares (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  completed_test_id uuid REFERENCES completed_tests(id),
  platform text,
  created_at timestamptz NOT NULL DEFAULT now()
);
