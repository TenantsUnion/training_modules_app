CREATE TABLE tu.content (
  id               BIGSERIAL PRIMARY KEY,
  content_data_id  BIGINT REFERENCES tu.quill_data (id) UNIQUE NOT NULL,
  title            VARCHAR(100),
  tags             VARCHAR(30) [],
  last_modified_at TIMESTAMP,
  created_at       TIMESTAMP DEFAULT now()
);

CREATE INDEX content_title_gin_idx
  ON tu.content USING GIN (to_tsvector('english', title));

CREATE INDEX content_tags_gin_idx
  ON tu.content USING GIN (tags);
