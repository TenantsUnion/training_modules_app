CREATE TABLE tu.course (
  id                           BIGINT PRIMARY KEY,
  version                      BIGINT       NOT NULL DEFAULT 0,
  header_data_id               BIGINT REFERENCES tu.quill_data (id),
  title                        VARCHAR(100) NOT NULL,
  description                  VARCHAR(300),
  time_estimate                INTEGER,
  open_enrollment              BOOLEAN      NOT NULL DEFAULT FALSE,
  active                       BOOLEAN      NOT NULL DEFAULT FALSE,
  --references id pk column of tu.modules
  ordered_module_ids           BIGINT []    NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  --references id pk column of tu.quill_data
  ordered_content_ids          BIGINT []    NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  --references id pk column of tu.question
  ordered_question_ids         BIGINT []    NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  --ordering of content and questions together -- ids from ordered_module_ids and ordered_content_ids
  ordered_content_question_ids BIGINT []    NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  last_modified_at             TIMESTAMP    NOT NULL DEFAULT now(),
  created_at                   TIMESTAMP    NOT NULL DEFAULT now()
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
  ON tu.course USING GIN (ordered_content_ids);

CREATE INDEX question_ids_gin_idx
  ON tu.course USING GIN (ordered_question_ids);
