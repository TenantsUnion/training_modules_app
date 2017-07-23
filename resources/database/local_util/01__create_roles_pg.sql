-- create roles for local development against postgres database
-- script is idempotent

DO
$body$
BEGIN
  --groups
  IF NOT exists(SELECT *
                FROM pg_catalog.pg_roles
                WHERE rolname = 'tu_crud')
  THEN
    CREATE ROLE tu_crud VALID UNTIL 'infinity';
  END IF;
  IF NOT exists(SELECT *
                FROM pg_catalog.pg_roles
                WHERE rolname = 'tu_read')
  THEN
    CREATE ROLE tu_read VALID UNTIL 'infinity';
  END IF;

END
$body$