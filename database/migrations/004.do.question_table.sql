CREATE TABLE tu.question (
  id               BIGINT PRIMARY KEY,
  version          BIGINT       NOT NULL DEFAULT 0,
  question_data_id BIGINT REFERENCES tu.quill_data (id) UNIQUE,
  question_type    VARCHAR(100) NOT NULL,
  answer_type      VARCHAR(100) NOT NULL,
  required         BOOLEAN               DEFAULT TRUE,
  created_at       TIMESTAMP    NOT NULL DEFAULT now(),
  last_modified_at TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX question_question_type_idx
  ON tu.question (question_type);

CREATE INDEX question_answer_type_idx
  ON tu.question (answer_type);

