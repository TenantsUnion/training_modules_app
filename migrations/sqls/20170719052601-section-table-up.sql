CREATE TABLE tu.section (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80),
  description VARCHAR(300),
  segments    BIGINT [] REFERENCES tu.segment (id)
)