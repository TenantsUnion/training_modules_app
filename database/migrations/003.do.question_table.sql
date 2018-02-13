CREATE TABLE tu.question (
  id                     TEXT PRIMARY KEY,
  version                INT4         NOT NULL DEFAULT 0,
  question_quill_id      TEXT REFERENCES tu.quill_data (id) UNIQUE,
  question_type          VARCHAR(100) NOT NULL,
  answer_type            VARCHAR(100) NOT NULL,
  --references id pk column of tu.question_option
  --correct_option_ids should be subset of option_ids
  correct_option_ids     TEXT []      NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references id pk column of tu.question_option
  option_ids             TEXT []      NOT NULL DEFAULT ARRAY [] :: TEXT [],
  randomize_option_order BOOLEAN      NOT NULL DEFAULT TRUE,
  answer_in_order        BOOLEAN      NOT NULL DEFAULT FALSE,
  can_pick_multiple      BOOLEAN      NOT NULL DEFAULT FALSE,
  last_modified_at       TIMESTAMPTZ  NOT NULL,
  created_at             TIMESTAMPTZ  NOT NULL
);

CREATE SEQUENCE tu.question_id_seq;
CREATE OR REPLACE FUNCTION tu.question_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('QU' || nextval('tu.question_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX question_question_type_idx
  ON tu.question (question_type);

CREATE INDEX question_answer_type_idx
  ON tu.question (answer_type);

