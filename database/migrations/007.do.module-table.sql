CREATE TABLE tu.module (
  id                  SERIAL PRIMARY KEY,
  header_content      BIGINT REFERENCES tu.quill_data (id),
  title               VARCHAR(100),
  description         VARCHAR(300),
  time_estimate       VARCHAR(300),
  active              BOOLEAN,
  ordered_section_ids BIGINT [] NOT NULL DEFAULT array[]::BIGINT[]
);

CREATE INDEX module_title_gin_idx
  ON tu.module USING GIN (to_tsvector('english', title));

CREATE INDEX module_description_gin_idx
  ON tu.module USING GIN (to_tsvector('english', description));

CREATE INDEX module_active
  ON tu.module (active);

CREATE INDEX module_ordered_sections_gin_idx
  ON tu.module USING GIN (ordered_section_ids);

