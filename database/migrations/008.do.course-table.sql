CREATE TABLE tu.course (
  id                 SERIAL PRIMARY KEY,
  title              VARCHAR(100),
  description        VARCHAR(300),
  time_estimate      VARCHAR(300),
  open_enrollment    BOOLEAN            DEFAULT FALSE,
  ordered_module_ids BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  content_ids        BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  question_ids       BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT []
);

CREATE INDEX course_title_gin_idx
  ON tu.course USING GIN (to_tsvector('english', title));

CREATE INDEX course_description_gin_idx
  ON tu.course USING GIN (to_tsvector('english', description));

CREATE INDEX course_open_enrollment_idx
  ON tu.course (open_enrollment);

CREATE INDEX course_ordered_module_ids_gin_idx
  ON tu.course USING GIN (ordered_module_ids);

CREATE INDEX content_ids_gin_idx
  ON tu.course USING GIN (content_ids);

CREATE INDEX question_ids_gin_idx
  ON tu.course USING GIN (question_ids);
