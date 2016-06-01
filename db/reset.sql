-- Reset database:

drop table if exists "changes";
drop table if exists "entities";
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
  doc_id varchar(40) UNIQUE PRIMARY KEY
);

CREATE TABLE "records" (
  document_id varchar(40) UNIQUE PRIMARY KEY,
  guid varchar(255) UNIQUE,
  title varchar(255),
  schema_name varchar(40),
  schema_version varchar(40),
  version integer,
  published_date timestamp,
  created timestamp,
  edited timestamp,
  edited_by varchar(40) REFERENCES users,
  training boolean,
  rubrics varchar(40)[],
  source varchar(40) REFERENCES documents,
  content json,
  meta json,
  info json,
  tsv tsvector
);

CREATE TABLE "changes" (
  document_id varchar(40) REFERENCES records,
  version integer,
  data json,
  created timestamp,
  owner varchar(40) REFERENCES users,
  PRIMARY KEY(document_id, version)
);

CREATE TABLE "entities" (
  entity_id varchar(40) UNIQUE PRIMARY KEY,
  name varchar(255),
  created timestamp,
  edited timestamp,
  author varchar(40) REFERENCES users,
  entity_class varchar(255),
  data json,
  tsv tsvector
);

CREATE TABLE "rubrics" (
  rubric_id varchar(40) UNIQUE PRIMARY KEY,
  name varchar(255),
  created timestamp,
  parent_id varchar(40) REFERENCES rubrics
);

CREATE TABLE "sessions" (
  session_token varchar(40) UNIQUE PRIMARY KEY,
  owner varchar(40) REFERENCES users,
  created timestamp
);