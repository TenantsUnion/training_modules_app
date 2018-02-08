CREATE TABLE tu.course_progress (
  version                 INT4                           NOT NULL DEFAULT 0,
  user_id                 TEXT REFERENCES tu.user (id)   NOT NULL,
  course_id               TEXT REFERENCES tu.course (id) NOT NULL,
  --references pk of viewed_content row
  viewed_content_ids      TEXT []                        NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references pk of question row
  correct_questions_ids   TEXT []                        NOT NULL DEFAULT ARRAY [] :: TEXT [],
  --references pk of question row
  submitted_questions_ids TEXT []                        NOT NULL DEFAULT ARRAY [] :: TEXT [],
  last_modified_at        TIMESTAMPTZ                    NOT NULL,
  created_at              TIMESTAMPTZ                    NOT NULL,
  PRIMARY KEY (user_id, course_id)
);

CREATE INDEX course_progress_user_id_idx
  ON tu.course_progress (user_id);

CREATE INDEX course_progress_course_id_idx
  ON tu.course_progress (course_id);

CREATE INDEX course_progress_viewed_content_ids_gin_idx
  ON tu.course_progress USING GIN (viewed_content_ids);

CREATE INDEX course_progress_correct_questions_ids_gin_idx
  ON tu.course_progress USING GIN (correct_questions_ids);

CREATE INDEX course_progress_submitted_questions_ids_gin_idx
  ON tu.course_progress USING GIN (submitted_questions_ids);

CREATE INDEX course_progress_last_modified_at_idx
  ON tu.course_progress (last_modified_at);
