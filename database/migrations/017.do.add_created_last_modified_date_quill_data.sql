ALTER TABLE tu.quill_data
  ADD COLUMN last_modified_at TIMESTAMP NOT NULL DEFAULT now();
ALTER TABLE tu.quill_data
  ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT now();
