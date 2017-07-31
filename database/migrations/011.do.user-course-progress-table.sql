CREATE TABLE tu.user_course_progress (
  user_id                 BIGINT REFERENCES tu.user (id),
  course_id               BIGINT REFERENCES tu.course (id),
  last_viewed_module      BIGINT REFERENCES tu.module (id),
  in_progress_module_ids  BIGINT [] NOT NULL DEFAULT array[]::BIGINT[],
  completed_module_ids    BIGINT [] NOT NULL DEFAULT array[]::BIGINT[],
  last_viewed_section     BIGINT REFERENCES tu.section (id),
  in_progress_section_ids BIGINT [] NOT NULL DEFAULT array[]::BIGINT[],
  completed_section_ids   BIGINT [] NOT NULL DEFAULT array[]::BIGINT[],
  last_viewed_content     BIGINT REFERENCES tu.content (id),
  last_viewed_question    BIGINT REFERENCES tu.question (id),
  course_progress         JSONB,
  PRIMARY KEY (user_id, course_id)
);

CREATE INDEX user_course_progress_user_id_idx
  ON tu.user_course_progress (user_id);

CREATE INDEX user_course_progress_course_id_idx
  ON tu.user_course_progress (course_id);

CREATE INDEX user_course_progress_in_progress_module_ids_gin_idx
  ON tu.user_course_progress USING GIN (in_progress_module_ids);

CREATE INDEX user_course_progress_completed_module_ids_gin_idx
  ON tu.user_course_progress USING GIN (completed_module_ids);

CREATE INDEX user_course_progress_in_progress_section_ids_gin_idx
  ON tu.user_course_progress USING GIN (in_progress_section_ids);

CREATE INDEX user_course_progress_completed_section_ids_gin_idx
  ON tu.user_course_progress USING GIN (completed_section_ids);

CREATE INDEX user_course_progress_course_progress_gin_idx
  ON tu.user_course_progress USING GIN (course_progress);