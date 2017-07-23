CREATE TABLE tu.module (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(80),
  description   VARCHAR(300),
  time_estimate VARCHAR(300),
  sections      INTEGER [] REFERENCES tu.section (id)
)