CREATE TABLE tu.account (
  id             TEXT PRIMARY KEY,
  version        INT4        NOT NULL DEFAULT 0,
  username       VARCHAR(30) UNIQUE,
  password       VARCHAR(20),
  password_salt  TEXT,
  email          VARCHAR(64) UNIQUE,
  created_at     TIMESTAMPTZ NOT NULL,
  last_active_at TIMESTAMPTZ NOT NULL
);

CREATE SEQUENCE tu.account_id_seq;
CREATE OR REPLACE FUNCTION tu.account_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('A' || nextval('tu.account_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX account_username_idx
  ON tu.account (username);

CREATE INDEX account_email_idx
  ON tu.account (email);