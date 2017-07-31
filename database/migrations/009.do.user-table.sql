CREATE TABLE tu.user (
  id                     BIGSERIAL PRIMARY KEY,
  username               VARCHAR(30) REFERENCES tu.account (username),
  first_name             VARCHAR(200),
  last_name              VARCHAR(200),
  admin_of_course_ids    BIGINT [] NOT NULL DEFAULT array[]::BIGINT[],
  enrolled_in_course_ids BIGINT [] NOT NULL DEFAULT array[]::BIGINT[],
  completed_course_ids   BIGINT [] NOT NULL DEFAULT array[]::BIGINT[],
  created_content        BIGINT [] NOT NULL DEFAULT array[]::BIGINT[]
);

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
