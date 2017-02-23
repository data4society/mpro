-- Reset database:

drop materialized view if exists "themed_records";
drop table if exists "apis";
drop table if exists "changes";
drop table if exists "rules";
drop table if exists "collections";
drop table if exists "references";
drop table if exists "entities";
drop table if exists "entity_classes";
drop table if exists "mentions";
drop table if exists "markups";
drop table if exists "records";
drop table if exists "documents";
drop table if exists "rubrics";
drop table if exists "sessions";
drop table if exists "users";
drop table if exists "variables";
drop table if exists "themes";
drop function if exists records_search_trigger();

CREATE TABLE "users" (
  user_id varchar(40) UNIQUE PRIMARY KEY,
  email varchar(255) UNIQUE,
  name varchar(255),
  created timestamp,
  login_key varchar(40) UNIQUE,
  password varchar(255),
  access boolean,
  super boolean
);

CREATE TABLE "themes" (
  theme_id varchar(40) UNIQUE PRIMARY KEY,
  title varchar(511),
  last_renew_time timestamp,
  words jsonb,
  app_id varchar(255)
);

CREATE TABLE "documents" (
  doc_id varchar(40) UNIQUE PRIMARY KEY,
  guid varchar(255) UNIQUE,
  doc_source text,
  stripped text,
  status integer,
  title varchar(255),
  published_date timestamp,
  created timestamp,
  meta jsonb,
  rubric_ids varchar(40)[],
  entity_ids varchar(40)[],
  markup jsonb,
  type varchar(255),
  url text,
  theme_id varchar(40) REFERENCES themes,
  app_id varchar(255)
);

CREATE TABLE "records" (
  document_id varchar(40) UNIQUE PRIMARY KEY,
  guid varchar(255) UNIQUE,
  url text,
  title varchar(255),
  schema_name varchar(40),
  schema_version varchar(40),
  version integer,
  published timestamp,
  created timestamp,
  edited timestamp,
  edited_by varchar(40) REFERENCES users,
  training boolean,
  rubrics varchar(40)[],
  entities varchar(40)[],
  collections varchar(40)[],
  source varchar(40) REFERENCES documents,
  content jsonb,
  meta jsonb,
  info jsonb,
  app_id varchar(255),
  full_text text,
  tsv tsvector
);

-- Records search index
CREATE INDEX tsv_records_idx ON records USING gin(tsv);
CREATE INDEX records_published_idx ON records(published);
CREATE INDEX records_collections_idx ON records USING gin(collections);
CREATE INDEX records_entities_idx ON records USING gin(entities);

CREATE FUNCTION records_search_trigger() RETURNS trigger AS $$
begin
  new.tsv :=
    setweight(to_tsvector('russian', COALESCE(new.title,'')), 'A') || 
    setweight(to_tsvector('russian', COALESCE(new.meta->>'abstract','')),'B') ||
    setweight(to_tsvector('russian', COALESCE(new."full_text",'')),'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorrecordsupdate BEFORE INSERT OR UPDATE
ON records FOR EACH ROW EXECUTE PROCEDURE records_search_trigger();

CREATE TABLE "changes" (
  document_id varchar(40) REFERENCES records,
  version integer,
  data jsonb,
  created timestamp,
  owner varchar(40) REFERENCES users,
  PRIMARY KEY(document_id, version)
);

CREATE TABLE "collections" (
  collection_id varchar(40) UNIQUE PRIMARY KEY,
  name varchar(255),
  created timestamp,
  edited timestamp,
  author varchar(40) REFERENCES users,
  private boolean,
  public boolean,
  description text,
  app_id varchar(255)
);

CREATE TABLE "rules" (
  rule_id varchar(40) UNIQUE PRIMARY KEY,
  collection_id varchar(40) REFERENCES collections,
  rubrics varchar(40)[],
  entities varchar(40)[],
  app_id varchar(255)
);

CREATE TABLE "entity_classes" (
  class_id varchar(40) UNIQUE PRIMARY KEY,
  name varchar(255)
);

CREATE TABLE "entities" (
  entity_id varchar(40) UNIQUE PRIMARY KEY,
  name varchar(255),
  created timestamp,
  edited timestamp,
  author varchar(40) REFERENCES users,
  entity_class varchar(255),
  labels text[],
  external_data jsonb,
  data jsonb,
  tsv tsvector
);

-- Entities created time index
CREATE INDEX entities_created_idx ON entities(created);

CREATE TABLE "markups" (
  markup_id varchar(40) UNIQUE PRIMARY KEY,
  document varchar(40) REFERENCES documents,
  name varchar(255),
  data jsonb,
  entity_classes varchar(40)[],
  type varchar(255)
);

CREATE TABLE "mentions" (
  mention_id varchar(40) UNIQUE PRIMARY KEY,
  markup varchar(40) REFERENCES markups,
  entity_class varchar(40),
  reference_ids varchar(40)[],
  outer_id integer
);

CREATE TABLE "references" (
  reference_id varchar(40) UNIQUE PRIMARY KEY,
  markup varchar(40) REFERENCES markups,
  entity_class varchar(40),
  entity varchar(40) REFERENCES entities,
  start_offset integer,
  end_offset integer,
  length_offset integer,
  outer_id integer
);

CREATE TABLE "rubrics" (
  rubric_id varchar(40) UNIQUE PRIMARY KEY,
  name varchar(255),
  created timestamp,
  counter boolean,
  parent_id varchar(40) REFERENCES rubrics,
  description text
);

CREATE TABLE "sessions" (
  session_token varchar(40) UNIQUE PRIMARY KEY,
  owner varchar(40) REFERENCES users,
  created timestamp
);

CREATE TABLE "variables" (
  name varchar(40) UNIQUE PRIMARY KEY,
  json jsonb
);

CREATE TABLE "apis" (
  key varchar(40) UNIQUE PRIMARY KEY,
  api text,
  param text,
  format text,
  live boolean,
  app_id varchar(255)
);

CREATE MATERIALIZED VIEW "themed_records"
AS
  SELECT r.document_id,
    r.title,
    r.schema_name,
    r.published,
    r.created,
    r.rubrics,
    r.entities,
    r.app_id,
    r.training,
    r.meta,
    r.tsv,
    t.theme_id,
    t.title AS theme
   FROM records r
     LEFT JOIN documents d ON r.source = d.doc_id
     LEFT JOIN themes t ON t.theme_id = d.theme_id
WITH NO DATA;

CREATE INDEX themed_records_created ON themed_records USING btree (created);
CREATE INDEX themed_records_theme_idx_created ON themed_records USING btree (theme_id, created DESC);
CREATE INDEX themed_records_theme_idx ON themed_records USING btree (theme_id);