CREATE TABLE tu.user (
  id                  SERIAL PRIMARY KEY,
  first_name          VARCHAR(30),
  last_name           VARCHAR(30),
  admin               INT REFERENCES tu.courses(id),
  username            VARCHAR(20),
  password            VARCHAR(20),
  password_salt       TEXT,
  created_at          TIMESTAMP,
  last_viewed_segment BIGINT REFERENCES tu.segment (id),
  curriculum          INTEGER REFERENCES tu.curriculum (id),
  progress            JSONB
);
