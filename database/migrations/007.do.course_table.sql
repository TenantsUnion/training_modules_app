CREATE TABLE tu.course (
  id                           TEXT PRIMARY KEY,
  version                      INT4         NOT NULL DEFAULT 0,
  header_data_id               TEXT REFERENCES tu.quill_data (id),
  title                        VARCHAR(100) NOT NULL,
  description                  VARCHAR(300),
  time_estimate                INTEGER,
  open_enrollment              BOOLEAN      NOT NULL DEFAULT FALSE,
  active                       BOOLEAN      NOT NULL DEFAULT FALSE,
  submit_individually          BOOLEAN      NOT NULL DEFAULT TRUE,
  --references id pk column of tu.modules
  ordered_module_ids           TEXT []      NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references id pk column of tu.quill_data
  ordered_content_ids          TEXT []      NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references id pk column of tu.question
  ordered_question_ids         TEXT []      NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --ordering of content and questions together -- ids from ordered_module_ids and ordered_content_ids
  ordered_content_question_ids TEXT []      NOT NULL DEFAULT ARRAY [] :: TEXT [],
  last_modified_at             TIMESTAMPTZ  NOT NULL,
  created_at                   TIMESTAMPTZ  NOT NULL
);

CREATE SEQUENCE tu.course_id_seq;
CREATE OR REPLACE FUNCTION tu.course_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('CO' || nextval('tu.course_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

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
