CREATE TABLE tu.question (
  id                     BIGINT PRIMARY KEY,
  version                BIGINT       NOT NULL DEFAULT 0,
  question_quill_id      BIGINT REFERENCES tu.quill_data (id) UNIQUE,
  question_type          VARCHAR(100) NOT NULL,
  answer_type            VARCHAR(100) NOT NULL,
  --references id pk column of tu.question_option
  --correct_option_ids should be subset of option_ids
  correct_option_ids     BIGINT []    NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  --references id pk column of tu.question_option
  option_ids             BIGINT []    NOT NULL DEFAULT ARRAY [] :: BIGINT [],
  randomize_option_order BOOLEAN      NOT NULL DEFAULT TRUE,
  answer_in_order        BOOLEAN      NOT NULL DEFAULT FALSE,
  can_pick_multiple      BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at             TIMESTAMP    NOT NULL DEFAULT now(),
  last_modified_at       TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX question_question_type_idx
  ON tu.question (question_type);

CREATE INDEX question_answer_type_idx
  ON tu.question (answer_type);

