CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_sub text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  country_hint varchar(8),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz
);
