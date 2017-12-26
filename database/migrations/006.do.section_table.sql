CREATE TABLE tu.section (
  id                           BIGINT PRIMARY KEY,
  version                      BIGINT    NOT NULL DEFAULT 0,
  header_data_id               BIGINT REFERENCES tu.quill_data (id),
  title                        VARCHAR(100),
  description                  VARCHAR(300),
  active                       BOOLEAN   NOT NULL DEFAULT FALSE,
  time_estimate                INTEGER,
  --references id pk column of tu.quill_data
  ordered_content_ids          BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  --references id pk column of tu.question
  ordered_question_ids         BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  --ordering of content and questions together -- ids from ordered_module_ids and ordered_content_ids
  ordered_content_question_ids BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  last_modified_at             TIMESTAMP NOT NULL DEFAULT now(),
  created_at                   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX section_title_gin_idx
  ON tu.section USING GIN (to_tsvector('english', title));

CREATE INDEX section_description_gin_idx
  ON tu.section USING GIN (to_tsvector('english', description));

CREATE INDEX section_ordered_content_ids_gin_idx
  ON tu.section USING GIN (ordered_content_ids);

CREATE INDEX section_ordered_question_ids_gin_idx
  ON tu.section USING GIN (ordered_question_ids);