CREATE TABLE tu.question_submission (
  id                         TEXT PRIMARY KEY,
  question_id                TEXT REFERENCES tu.question (id) NOT NULL,
  user_id                    TEXT REFERENCES tu.user (id)     NOT NULL,
  created_at                 TIMESTAMPTZ                      NOT NULL,
  chosen_question_option_ids TEXT []                          NOT NULL DEFAULT ARRAY [] :: TEXT [],
  correct                    BOOLEAN                          NOT NULL
);

CREATE SEQUENCE tu.question_submission_id_seq;
CREATE OR REPLACE FUNCTION tu.question_submission_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('QS' || nextval('tu.question_submission_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX question_submission_question_id_correct_idx
  ON tu.question_submission (question_id, correct);
CREATE INDEX question_submission_user_id_idx
  ON tu.question_submission (user_id);
CREATE INDEX question_submission_created_at_idx
  ON tu.question_submission (created_at);

CREATE INDEX question_submissions_chose_question_option_ids_gin_idx
  ON tu.question_submission USING GIN (chosen_question_option_ids);
