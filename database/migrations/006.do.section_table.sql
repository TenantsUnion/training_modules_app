CREATE TABLE tu.section (
  id                           TEXT PRIMARY KEY,
  version                      INT4        NOT NULL DEFAULT 0,
  header_data_id               TEXT REFERENCES tu.quill_data (id),
  title                        VARCHAR(100),
  description                  VARCHAR(300),
  active                       BOOLEAN     NOT NULL DEFAULT FALSE,
  time_estimate                INTEGER,
  --references id pk column of tu.quill_data
  ordered_content_ids          TEXT []     NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references id pk column of tu.question
  ordered_question_ids         TEXT []     NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --ordering of content and questions together -- ids from ordered_module_ids and ordered_content_ids
  ordered_content_question_ids TEXT []     NOT NULL DEFAULT ARRAY [] :: TEXT [],
  last_modified_at             TIMESTAMPTZ NOT NULL,
  created_at                   TIMESTAMPTZ NOT NULL
);

CREATE SEQUENCE tu.section_id_seq;
CREATE OR REPLACE FUNCTION tu.section_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('SE' || nextval('tu.section_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;


CREATE INDEX section_title_gin_idx
  ON tu.section USING GIN (to_tsvector('english', title));

CREATE INDEX section_description_gin_idx
  ON tu.section USING GIN (to_tsvector('english', description));

CREATE INDEX section_ordered_content_ids_gin_idx
  ON tu.section USING GIN (ordered_content_ids);

CREATE INDEX section_ordered_question_ids_gin_idx
  ON tu.section USING GIN (ordered_question_ids);