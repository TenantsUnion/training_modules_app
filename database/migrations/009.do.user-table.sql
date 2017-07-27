CREATE TABLE tu.user (
  id                     BIGSERIAL PRIMARY KEY,
  account_id             BIGINT REFERENCES tu.account (id),
  first_name             VARCHAR(200),
  last_name              VARCHAR(200),
  admin_of_course_ids    BIGINT [],
  enrolled_in_course_ids BIGINT [],
  completed_course_ids   BIGINT []
);

CREATE INDEX user_account_id_idx
  ON tu.user (account_id);

CREATE INDEX user_first_name_gin_idx
  ON tu.user USING GIN (to_tsvector('english', first_name));

CREATE INDEX user_last_name_gin_idx
  ON tu.user USING GIN (to_tsvector('english', last_name));

CREATE INDEX user_admin_of_course_ids_gin_idx
  ON tu.user USING GIN (admin_of_course_ids);

CREATE INDEX user_enrolled_in_course_ids_gin_idx
  ON tu.user USING GIN (enrolled_in_course_ids);
