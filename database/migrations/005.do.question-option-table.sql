CREATE TABLE tu.question_option (
  id                  SERIAL PRIMARY KEY,
  question_id         BIGINT REFERENCES tu.question (id)      NOT NULL,
  answer              BOOLEAN DEFAULT FALSE,
  option_data_id      BIGINT REFERENCES tu.quill_data (id) NOT NULL,
  explanation_data_id BIGINT REFERENCES tu.quill_data (id) NOT NULL
);

CREATE INDEX question_option_question_id_idx
  ON tu.question_option (question_id);