CREATE TABLE tu.question (
  id                 SERIAL PRIMARY KEY,
  question           BIGINT REFERENCES tu.content (id),
  options            BIGINT [] REFERENCES tu.content (id),
  order_options      BOOLEAN,
  answer             INT [],
  feedback           BIGINT REFERENCES tu.content (id),
  additionalFeedback JSONB
);