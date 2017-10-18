CREATE TABLE tu.account (
  id             BIGINT PRIMARY KEY,
  username       VARCHAR(30) UNIQUE,
  password       VARCHAR(20),
  password_salt  TEXT,
  email          VARCHAR(64) UNIQUE,
  created_at     TIMESTAMP NOT NULL DEFAULT now(),
  last_active_at TIMESTAMP NOT NULL DEFAULT now()
);


CREATE INDEX account_username_idx
  ON tu.account (username);

CREATE INDEX account_email_idx
  ON tu.account (email);