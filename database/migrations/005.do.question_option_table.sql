CREATE TABLE tu.question_option (
  id                   BIGINT PRIMARY KEY,
  version              BIGINT                                  NOT NULL DEFAULT 0,
  option_quill_id      BIGINT REFERENCES tu.quill_data (id)    NOT NULL,
  explanation_quill_id BIGINT REFERENCES tu.quill_data (id)    NOT NULL,
  created_at           TIMESTAMP                               NOT NULL DEFAULT now(),
  last_modified_at     TIMESTAMP                               NOT NULL DEFAULT now()
);

CREATE INDEX question_option_quill_id_idx
  ON tu.question_option (option_quill_id);

CREATE INDEX question_explanation_quill_id_idx
  ON tu.question_option (explanation_quill_id);
