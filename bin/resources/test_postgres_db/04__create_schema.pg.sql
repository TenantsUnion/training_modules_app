DROP TABLE IF EXISTS public.test_tu_schema_version;
DROP SCHEMA IF EXISTS tu CASCADE;
CREATE SCHEMA IF NOT EXISTS tu;

GRANT USAGE, CREATE ON SCHEMA tu TO GROUP tu_crud;
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER ON ALL TABLES IN SCHEMA tu to tu_crud;
GRANT SELECT ON ALL TABLES IN SCHEMA tu to tu_read;