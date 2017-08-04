CREATE TABLE tu.quill_data (
  id          BIGINT PRIMARY KEY,
  editor_json JSONB
);

CREATE INDEX quill_data_editor_json_gin_idx
  ON tu.quill_data USING GIN (editor_json);
