CREATE TABLE tu.section_progress (
  version                INT4                            NOT NULL DEFAULT 0,
  user_id                TEXT REFERENCES tu.user (id)    NOT NULL,
  id                     TEXT REFERENCES tu.section (id) NOT NULL,
  --key references pk of viewed_content row, timestamptz
  viewed_content_ids     JSONB                           NOT NULL DEFAULT '{}' :: JSONB,
  --key references pk of question row, timestamptz
  correct_question_ids   JSONB                           NOT NULL DEFAULT '{}' :: JSONB,
  --key references pk of question row, timestamptz
  submitted_question_ids JSONB                           NOT NULL DEFAULT '{}' :: JSONB,
  training_completed     TIMESTAMPTZ                              DEFAULT NULL,
  last_viewed_at         TIMESTAMPTZ                              DEFAULT NULL,
  last_modified_at       TIMESTAMPTZ                     NOT NULL,
  created_at             TIMESTAMPTZ                     NOT NULL,
  PRIMARY KEY (user_id, id)
);

CREATE INDEX section_progress_user_id_idx
  ON tu.section_progress (user_id);

CREATE INDEX section_progress_section_id_idx
  ON tu.section_progress (id);

CREATE INDEX section_progress_viewed_content_ids_gin_idx
  ON tu.section_progress USING GIN (viewed_content_ids);

CREATE INDEX section_progress_correct_question_ids_gin_idx
  ON tu.section_progress USING GIN (correct_question_ids);

CREATE INDEX section_progress_submitted_question_ids_gin_idx
  ON tu.section_progress USING GIN (submitted_question_ids);

CREATE INDEX section_progress_last_modified_at_idx
  ON tu.section_progress (last_modified_at);

