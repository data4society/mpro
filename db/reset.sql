-- Reset database:

drop table if exists "changes";
drop table if exists "references";
drop table if exists "mentions";
drop table if exists "entities";
drop table if exists "entity_classes";
drop table if exists "markups";
drop table if exists "records";
drop table if exists "documents";
drop table if exists "rubrics";
drop table if exists "sessions";
drop table if exists "users";

CREATE TABLE "users" (
  user_id varchar(40) UNIQUE PRIMARY KEY,
  email varchar(255) UNIQUE,
  name varchar(255),
  created timestamp,
  login_key varchar(40) UNIQUE,
  password varchar(255)
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
  type varchar(255)
);

CREATE TABLE "records" (
  document_id varchar(40) UNIQUE PRIMARY KEY,
  guid varchar(255) UNIQUE,
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
  source varchar(40) REFERENCES documents,
  content jsonb,
  meta jsonb,
  info jsonb,
  tsv tsvector
);

CREATE TABLE "changes" (
  document_id varchar(40) REFERENCES records,
  version integer,
  data jsonb,
  created timestamp,
  owner varchar(40) REFERENCES users,
  PRIMARY KEY(document_id, version)
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
  data jsonb,
  tsv tsvector
);

CREATE TABLE "markups" (
  markup_id varchar(40) UNIQUE PRIMARY KEY,
  document varchar(40) REFERENCES documents,
  name varchar(255),
  data jsonb,
  entity_classes varchar(40)[],
  type varchar(255)
);

CREATE TABLE "references" (
  reference_id varchar(40) UNIQUE PRIMARY KEY,
  markup varchar(40) REFERENCES markups,
  entity_class varchar(40)/* REFERENCES entity_classes*/,
  entity varchar(40) REFERENCES entities,
  start_offset integer,
  end_offset integer,
  length_offset integer,
  outer_id integer
);

CREATE TABLE "mentions" (
  mention_id varchar(40) UNIQUE PRIMARY KEY,
  markup varchar(40) REFERENCES markups,
  entity_class varchar(40)/* REFERENCES entity_classes*/,
  reference_ids varchar(40)[],
  outer_id integer
);

CREATE TABLE "rubrics" (
  rubric_id varchar(40) UNIQUE PRIMARY KEY,
  name varchar(255),
  created timestamp,
  parent_id varchar(40) REFERENCES rubrics,
  description text
);

CREATE TABLE "sessions" (
  session_token varchar(40) UNIQUE PRIMARY KEY,
  owner varchar(40) REFERENCES users,
  created timestamp
);