CREATE TABLE tu.user_course_progress (
  version                 INT4    NOT NULL DEFAULT 0,
  user_id                 TEXT REFERENCES tu.user (id),
  course_id               TEXT REFERENCES tu.course (id),
  last_viewed_module      TEXT REFERENCES tu.module (id),
  in_progress_module_ids  TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT [],
  completed_module_ids    TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT [],
  last_viewed_section     TEXT REFERENCES tu.section (id),
  in_progress_section_ids TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT [],
  completed_section_ids   TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT [],
  last_viewed_question    TEXT REFERENCES tu.question (id),
  course_progress         JSONB,
  PRIMARY KEY (user_id, course_id)
);

CREATE SEQUENCE tu.user_course_progress_id_seq;
CREATE OR REPLACE FUNCTION tu.user_course_progress_id(how_many INTEGER) RETURNS SETOF TEXT AS $$
SELECT ('UCP' || nextval('tu.user_course_progress_id_seq')) FROM generate_series(1, how_many);
$$ LANGUAGE SQL;

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