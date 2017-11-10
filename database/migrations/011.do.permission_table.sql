CREATE TABLE tu.permission (
  id      BIGINT PRIMARY KEY,
  version BIGINT NOT NULL DEFAULT 0,
  action  TEXT
);

CREATE INDEX tu_permission_idx
  ON tu.permission (action);

