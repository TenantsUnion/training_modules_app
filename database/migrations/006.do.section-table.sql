CREATE TABLE tu.section (
  id                   BIGINT PRIMARY KEY,
  header_data_id       BIGINT REFERENCES tu.quill_data (id),
  title                VARCHAR(100),
  description          VARCHAR(300),
  ordered_content_ids  BIGINT [] NOT NULL DEFAULT array[]::BIGINT[],
  ordered_question_ids BIGINT [] NOT NULL DEFAULT array[]::BIGINT[]
);

CREATE INDEX section_title_gin_idx
  ON tu.section USING GIN (to_tsvector('english', title));

CREATE INDEX section_description_gin_idx
  ON tu.section USING GIN (to_tsvector('english', description));

CREATE INDEX section_ordered_content_ids_gin_idx
  ON tu.section USING GIN (ordered_content_ids);

CREATE INDEX section_ordered_question_ids_gin_idx
  ON tu.section USING GIN (ordered_question_ids);