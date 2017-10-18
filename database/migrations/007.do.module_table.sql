CREATE TABLE tu.module (
  id                  BIGINT PRIMARY KEY,
  header_content      BIGINT REFERENCES tu.quill_data (id),
  title               VARCHAR(100),
  description         VARCHAR(300),
  time_estimate       INTEGER,
  active              BOOLEAN,
  ordered_section_ids BIGINT [] NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  last_modified_at    TIMESTAMP NOT NULL DEFAULT now(),
  created_at          TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX module_title_gin_idx
  ON tu.module USING GIN (to_tsvector('english', title));

CREATE INDEX module_description_gin_idx
  ON tu.module USING GIN (to_tsvector('english', description));

CREATE INDEX module_active
  ON tu.module (active);

CREATE INDEX module_ordered_sections_gin_idx
  ON tu.module USING GIN (ordered_section_ids);

