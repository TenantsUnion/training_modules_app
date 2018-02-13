CREATE TABLE tu.question_option (
  id                   TEXT PRIMARY KEY,
  version              INT4                                  NOT NULL DEFAULT 0,
  option_quill_id      TEXT REFERENCES tu.quill_data (id)    NOT NULL,
  explanation_quill_id TEXT REFERENCES tu.quill_data (id)    NOT NULL,
  last_modified_at     TIMESTAMPTZ                           NOT NULL,
  created_at           TIMESTAMPTZ                           NOT NULL
);

CREATE SEQUENCE tu.question_option_id_seq;
CREATE OR REPLACE FUNCTION tu.question_option_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('QO' || nextval('tu.question_option_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX question_option_quill_id_idx
  ON tu.question_option (option_quill_id);

CREATE INDEX question_explanation_quill_id_idx
  ON tu.question_option (explanation_quill_id);
