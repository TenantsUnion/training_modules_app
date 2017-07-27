CREATE SEQUENCE tu.event_seq START WITH 1 NO CYCLE CACHE 1;

CREATE TABLE tu.event_entry (
  id              BIGSERIAL PRIMARY KEY,
  timestamp       TIMESTAMP NOT NULL,
  domain_type     TEXT      NOT NULL,
  domain_type_id  BIGINT    NOT NULL,
  event_type      TEXT      NOT NULL,
  sequence_number BIGINT    NOT NULL,
  payload         JSONB     NOT NULL,
  meta_data       JSONB     NOT NULL,
  event_sequence  BIGINT    NOT NULL DEFAULT nextval('tu.event_seq') UNIQUE,
  UNIQUE (domain_type, domain_type_id, sequence_number)
);

CREATE INDEX event_entry_seq_idx
  ON tu.event_entry (event_sequence);

CREATE INDEX domain_type_idx
  ON tu.event_entry (domain_type, domain_type_id, event_type);

CREATE INDEX event_type_idx
  ON tu.event_entry (domain_type, event_type);