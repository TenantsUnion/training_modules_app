--create local database account
DO
$body$
BEGIN
IF NOT exists(SELECT *
              FROM pg_catalog.pg_roles
              WHERE rolname = 'tu_dev_db_user')
THEN
  CREATE ROLE tu_dev_db_user LOGIN PASSWORD 'development_only' VALID UNTIL 'infinity';
  GRANT tu_crud TO tu_dev_db_user;
END IF;
END
$body$
