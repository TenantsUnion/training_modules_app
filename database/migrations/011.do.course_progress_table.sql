CREATE TABLE tu.course_progress (
  version                INT4                           NOT NULL DEFAULT 0,
  user_id                TEXT REFERENCES tu.user (id)   NOT NULL,
  id                     TEXT REFERENCES tu.course (id) NOT NULL,
  --key references pk of viewed_content row, timestamptz
  viewed_content_ids     JSONB                          NOT NULL DEFAULT '{}' :: JSONB,
  --key references pk of question row, timestamptz
  completed_question_ids JSONB                          NOT NULL DEFAULT '{}' :: JSONB,
  --key references pk of question row, timestamptz
  submitted_question_ids JSONB                          NOT NULL DEFAULT '{}' :: JSONB,
  questions_completed    TIMESTAMPTZ                             DEFAULT NULL,
  content_viewed         TIMESTAMPTZ                             DEFAULT NULL,
  course_completed       TIMESTAMPTZ                             DEFAULT NULL,
  last_viewed_at         TIMESTAMPTZ                             DEFAULT NULL,
  last_modified_at       TIMESTAMPTZ                    NOT NULL,
  created_at             TIMESTAMPTZ                    NOT NULL,
  PRIMARY KEY (user_id, id)
);

CREATE INDEX course_progress_user_id_idx
  ON tu.course_progress (user_id);

CREATE INDEX course_progress_course_id_idx
  ON tu.course_progress (id);

CREATE INDEX course_progress_content_viewed_idx
  ON tu.course_progress (content_viewed);

CREATE INDEX course_progress_questions_completed_idx
  ON tu.course_progress (questions_completed);

CREATE INDEX course_progress_viewed_content_ids_gin_idx
  ON tu.course_progress USING GIN (viewed_content_ids);

CREATE INDEX course_progress_completed_question_ids_gin_idx
  ON tu.course_progress USING GIN (completed_question_ids);

CREATE INDEX course_progress_submitted_question_ids_gin_idx
  ON tu.course_progress USING GIN (submitted_question_ids);

CREATE INDEX course_progress_last_modified_at_idx
  ON tu.course_progress (last_modified_at);
