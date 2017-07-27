CREATE TABLE tu.account (
  id             BIGSERIAL PRIMARY KEY,
  username       VARCHAR(30) UNIQUE,
  password       VARCHAR(20),
  password_salt  TEXT,
  created_at     TIMESTAMP,
  last_active_at TIMESTAMP
);