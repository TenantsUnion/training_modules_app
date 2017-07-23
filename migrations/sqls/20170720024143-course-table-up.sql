CREATE TABLE tu.course (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80),
  description VARCHAR(300),
  modules     INTEGER [] REFERENCES tu.module (id)
);
