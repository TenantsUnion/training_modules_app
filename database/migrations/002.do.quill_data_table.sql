CREATE TABLE tu.quill_data (
  id               BIGINT PRIMARY KEY,
  version          BIGINT    NOT NULL DEFAULT 0,
  -- QuillJS Delta object
  editor_json      JSONB,
  created_at       TIMESTAMP NOT NULL DEFAULT now(),
  last_modified_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX quill_data_editor_json_gin_idx
  ON tu.quill_data USING GIN (editor_json);
