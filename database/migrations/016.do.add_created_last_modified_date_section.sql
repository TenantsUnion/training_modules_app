ALTER TABLE tu.section
  ADD COLUMN last_modified_at TIMESTAMP NOT NULL DEFAULT now();
ALTER TABLE tu.section
  ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT now();
