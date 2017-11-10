CREATE TABLE tu.user_content (
  id               BIGINT PRIMARY KEY,
  version          BIGINT                                      NOT NULL DEFAULT 0,
  content_data_id  BIGINT REFERENCES tu.quill_data (id) UNIQUE NOT NULL,
  title            VARCHAR(100),
  tags             VARCHAR(30) []                              NOT NULL DEFAULT ARRAY [] :: VARCHAR [],
  last_modified_at TIMESTAMP                                   NOT NULL DEFAULT now(),
  created_at       TIMESTAMP                                   NOT NULL DEFAULT now()
);

CREATE INDEX user_content_title_gin_idx
  ON tu.user_content USING GIN (to_tsvector('english', title));

CREATE INDEX user_content_tags_gin_idx
  ON tu.user_content USING GIN (tags);
