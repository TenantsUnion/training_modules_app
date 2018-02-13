CREATE TABLE tu.viewed_content (
  user_id    TEXT REFERENCES tu.user (id),
  content_id TEXT REFERENCES tu.quill_data (id),
  created_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, content_id)
);

CREATE INDEX viewed_content_user_id_idx
  ON tu.viewed_content (user_id);
CREATE INDEX viewed_content_content_id_idx
  ON tu.viewed_content (content_id);
CREATE INDEX viewed_content_created_at_idx
  ON tu.viewed_content (created_at);
