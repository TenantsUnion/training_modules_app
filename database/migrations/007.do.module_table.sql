CREATE TABLE tu.module (
  id                           TEXT PRIMARY KEY,
  version                      INT4        NOT NULL DEFAULT 0,
  header_data_id               TEXT REFERENCES tu.quill_data (id),
  title                        VARCHAR(100),
  description                  VARCHAR(300),
  time_estimate                INTEGER,
  active                       BOOLEAN     NOT NULL DEFAULT FALSE,
  --references id pk column of tu.section
  ordered_section_ids          TEXT []     NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references id pk column of tu.quill_data
  ordered_content_ids          TEXT []     NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references id pk column of tu.question
  ordered_question_ids         TEXT []     NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --ordering of content and questions together -- ids from ordered_module_ids and ordered_content_ids
  ordered_content_question_ids TEXT []     NOT NULL DEFAULT ARRAY [] :: TEXT [],
  last_modified_at             TIMESTAMPTZ NOT NULL,
  created_at                   TIMESTAMPTZ NOT NULL
);

CREATE SEQUENCE tu.module_id_seq;
CREATE OR REPLACE FUNCTION tu.module_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('MO' || nextval('tu.module_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX module_title_gin_idx
  ON tu.module USING GIN (to_tsvector('english', title));

CREATE INDEX module_description_gin_idx
  ON tu.module USING GIN (to_tsvector('english', description));

CREATE INDEX module_active
  ON tu.module (active);

CREATE INDEX module_ordered_sections_gin_idx
  ON tu.module USING GIN (ordered_section_ids);

