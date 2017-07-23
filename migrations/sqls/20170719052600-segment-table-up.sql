CREATE TABLE tu.segment (
  id           BIGSERIAL PRIMARY KEY,
  content      BIGINT REFERENCES tu.content (id),
  question     BIGINT REFERENCES tu.question (id),
  tags         VARCHAR(30) [],
  date_created TIMESTAMP,
  last_edited  TIMESTAMP
);

CREATE INDEX content_gin_idx
  ON tu.segment USING GIN (content);

CREATE INDEX content_gin_idx
  ON tu.segment USING GIN (tags);


