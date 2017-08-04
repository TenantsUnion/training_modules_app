CREATE TABLE tu.user_permissions (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT REFERENCES tu.user (id),
  permissions BIGINT ARRAY NOT NULL DEFAULT ARRAY [] :: BIGINT []
);

CREATE INDEX tu_user_permissions_user_id_idx
  ON tu.user_permissions (user_id);

CREATE INDEX tu_user_permissions_permissions_gin_idx
  ON tu.user_permissions USING GIN (permissions);