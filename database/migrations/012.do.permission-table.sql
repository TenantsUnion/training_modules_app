CREATE TABLE tu.permission_table (
  id BIGSERIAL PRIMARY KEY,
  action text
);

CREATE INDEX tu_permission_idx on tu.permission_table(action);

