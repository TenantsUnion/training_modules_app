--not used yet
CREATE TABLE tu.permission (
  id      TEXT PRIMARY KEY,
  version INT4 NOT NULL DEFAULT 0,
  action  TEXT
);

CREATE SEQUENCE tu.permission_id_seq;
CREATE OR REPLACE FUNCTION tu.permission_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('PE' || nextval('tu.permission_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX tu_permission_idx
  ON tu.permission (action);

