CREATE TABLE tu.user_content (
  id               TEXT PRIMARY KEY,
  version          INT4                                      NOT NULL DEFAULT 0,
  content_data_id  TEXT REFERENCES tu.quill_data (id) UNIQUE NOT NULL,
  title            VARCHAR(100),
  tags             VARCHAR(30) []                            NOT NULL DEFAULT ARRAY [] :: VARCHAR [],
  last_modified_at TIMESTAMPTZ                               NOT NULL,
  created_at       TIMESTAMPTZ                               NOT NULL
);

CREATE SEQUENCE tu.user_content_id_seq;
CREATE OR REPLACE FUNCTION tu.user_content_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('UC' || nextval('tu.user_content_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX user_content_title_gin_idx
  ON tu.user_content USING GIN (to_tsvector('english', title));

CREATE INDEX user_content_tags_gin_idx
  ON tu.user_content USING GIN (tags);
