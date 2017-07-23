CREATE TABLE tu.module (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(80),
  description   VARCHAR(300),
  time_estimate VARCHAR(300),
  visible       BOOLEAN,
  last_edited   TIMESTAMP,
  sections      INTEGER [] REFERENCES tu.section (id)
)