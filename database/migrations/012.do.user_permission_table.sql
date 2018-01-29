CREATE TABLE tu.user_permissions (
  id          TEXT PRIMARY KEY,
  version     INT4       NOT NULL DEFAULT 0,
  user_id     TEXT REFERENCES tu.user (id),
  permissions TEXT ARRAY NOT NULL DEFAULT ARRAY [] :: BIGINT []
);

CREATE SEQUENCE tu.user_permissions_id_seq;
CREATE OR REPLACE FUNCTION tu.user_permissions_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('UP' || nextval('tu.user_permissions_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX tu_user_permissions_user_id_idx
  ON tu.user_permissions (user_id);

CREATE INDEX tu_user_permissions_permissions_gin_idx
  ON tu.user_permissions USING GIN (permissions);