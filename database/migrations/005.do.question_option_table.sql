CREATE TABLE tu.question_option (
  id                   BIGINT PRIMARY KEY,
  version              BIGINT                                  NOT NULL DEFAULT 0,
  question_id          BIGINT REFERENCES tu.question (id)      NOT NULL,
  answer               BOOLEAN                                          DEFAULT FALSE,
  option_quill_id      BIGINT REFERENCES tu.quill_data (id)    NOT NULL,
  explanation_quill_id BIGINT REFERENCES tu.quill_data (id)    NOT NULL,
  created_at           TIMESTAMP                               NOT NULL DEFAULT now(),
  last_modified_at     TIMESTAMP                               NOT NULL DEFAULT now()
);

CREATE INDEX question_option_question_id_idx
  ON tu.question_option (question_id);