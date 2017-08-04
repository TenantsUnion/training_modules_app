CREATE TABLE tu.permission (
  id BIGINT PRIMARY KEY,
  action text
);

CREATE INDEX tu_permission_idx on tu.permission_table(action);

