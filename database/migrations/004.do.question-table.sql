CREATE TABLE tu.question (
  id               BIGSERIAL PRIMARY KEY,
  question_data_id BIGINT REFERENCES tu.quill_data (id) UNIQUE,
  question_type    VARCHAR(100) NOT NULL,
  answer_type      VARCHAR(100) NOT NULL,
  required         BOOLEAN DEFAULT TRUE
);

CREATE INDEX question_question_type_idx
  ON tu.question (question_type);

CREATE INDEX question_answer_type_idx
  ON tu.question (answer_type);

