CREATE TABLE tu.quill_data (
  id               TEXT PRIMARY KEY,
  version          INT4        NOT NULL DEFAULT 0,
  -- QuillJS Delta object
  editor_json      JSONB,
  created_at       TIMESTAMPTZ NOT NULL,
  last_modified_at TIMESTAMPTZ NOT NULL
);

CREATE SEQUENCE tu.quill_data_id_seq;
CREATE OR REPLACE FUNCTION tu.quill_data_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('QD' || nextval('tu.quill_data_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

CREATE INDEX quill_data_editor_json_gin_idx
  ON tu.quill_data USING GIN (editor_json);
