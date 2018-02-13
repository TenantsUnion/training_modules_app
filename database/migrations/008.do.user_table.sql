CREATE TABLE tu.user (
  id                     TEXT PRIMARY KEY REFERENCES tu.account (id),
  version                INT4      NOT NULL DEFAULT 0,
  username               VARCHAR(30) REFERENCES tu.account (username),
  first_name             VARCHAR(200),
  last_name              VARCHAR(200),
  admin_of_course_ids    TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT [],
  enrolled_in_course_ids TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT [],
  completed_course_ids   TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT [],
  created_content_ids    TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT []
);

CREATE SEQUENCE tu.user_id_seq;
CREATE OR REPLACE FUNCTION tu.user_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('US' || nextval('tu.user_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX user_username_idx
  ON tu.user (username);

CREATE INDEX user_first_name_gin_idx
  ON tu.user USING GIN (to_tsvector('english', first_name));

CREATE INDEX user_last_name_gin_idx
  ON tu.user USING GIN (to_tsvector('english', last_name));

CREATE INDEX user_admin_of_course_ids_gin_idx
  ON tu.user USING GIN (admin_of_course_ids);

CREATE INDEX user_enrolled_in_course_ids_gin_idx
  ON tu.user USING GIN (enrolled_in_course_ids);
