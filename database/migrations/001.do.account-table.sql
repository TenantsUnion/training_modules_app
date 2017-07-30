CREATE TABLE tu.account (
  id             BIGSERIAL PRIMARY KEY,
  username       VARCHAR(30) UNIQUE,
  password       VARCHAR(20),
  password_salt  TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT current_date,
  last_active_at TIMESTAMP NOT NULL DEFAULT  current_date,
  email          VARCHAR(64)
);

CREATE INDEX username_idx ON tu.account(username);