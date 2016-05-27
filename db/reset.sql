-- Reset database:

drop table if exists "changes";
drop table if exists "documents";
drop table if exists "entities";
drop table if exists "thematics";
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
  document_id varchar(40) UNIQUE PRIMARY KEY,
  guid varchar(255) UNIQUE,
  title varchar(255),
  schema_name varchar(40),
  schema_version varchar(40),
  version integer,
  issue_date timestamp,
  created timestamp,
  validated timestamp,
  validated_by varchar(40) REFERENCES users,
  state varchar(40),
  training boolean,
  source text,
  stripped text,
  content json,
  meta json,
  info json,
  tsv tsvector
);

CREATE TABLE "changes" (
  document_id varchar(40) REFERENCES documents,
  version integer,
  data json,
  created timestamp,
  owner varchar(40) REFERENCES users,
  PRIMARY KEY(document_id, version)
);

CREATE TABLE "entities" (
  entity_id varchar(40) UNIQUE PRIMARY KEY,
  title varchar(255),
  created timestamp,
  edited timestamp,
  author varchar(40) REFERENCES users,
  class varchar(255),
  data json,
  tsv tsvector
);

CREATE TABLE "thematics" (
  thematic_id varchar(40) UNIQUE PRIMARY KEY,
  title varchar(255),
  created timestamp,
  parent_id varchar(40) REFERENCES thematics
);

CREATE TABLE "sessions" (
  session_token varchar(40) UNIQUE PRIMARY KEY,
  owner varchar(40) REFERENCES users,
  created timestamp
);