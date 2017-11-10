CREATE TABLE tu.user (
  id                     BIGINT PRIMARY KEY REFERENCES tu.account (id),
  version                BIGINT    NOT NULL DEFAULT 0,
  username               VARCHAR(30) REFERENCES tu.account (username),
  first_name             VARCHAR(200),
  last_name              VARCHAR(200),
  admin_of_course_ids    BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  enrolled_in_course_ids BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  completed_course_ids   BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  created_content_ids    BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT []
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
