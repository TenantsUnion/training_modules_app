CREATE TABLE tu.module_progress (
  version                 INT4                           NOT NULL DEFAULT 0,
  user_id                 TEXT REFERENCES tu.user (id)   NOT NULL,
  module_id               TEXT REFERENCES tu.module (id) NOT NULL,
  --references pk of viewed_content row
  viewed_content_ids      TEXT []                        NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references pk of question row
  correct_questions_ids   TEXT []                        NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references pk of question row
  submitted_questions_ids TEXT []                        NOT NULL DEFAULT ARRAY [] :: TEXT [],
  last_viewed_at          TIMESTAMPTZ                             DEFAULT NULL,
  last_modified_at        TIMESTAMPTZ                    NOT NULL,
  created_at              TIMESTAMPTZ                    NOT NULL,
  PRIMARY KEY (user_id, module_id)
);

CREATE INDEX module_progress_user_id_idx
  ON tu.module_progress (user_id);

CREATE INDEX module_progress_module_id_idx
  ON tu.module_progress (module_id);

CREATE INDEX module_progress_viewed_content_ids_gin_idx
  ON tu.module_progress USING GIN (viewed_content_ids);

CREATE INDEX module_progress_correct_questions_ids_gin_idx
  ON tu.module_progress USING GIN (correct_questions_ids);

CREATE INDEX module_progress_submitted_questions_ids_gin_idx
  ON tu.module_progress USING GIN (submitted_questions_ids);

CREATE INDEX module_progress_last_modified_at_idx
  ON tu.module_progress (last_modified_at);

