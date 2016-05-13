-- Reset database:

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
  password varchar(255)
);

CREATE TABLE "documents" (
  document_id varchar(40) UNIQUE PRIMARY KEY,
  guid varchar(255) UNIQUE,
  title varchar(255),
  type varchar(255),
  issue_date timestamp,
  created timestamp,
  validated timestamp,
  validated_by varchar(40) REFERENCES users,
  state varchar(40),
  source text,
  stripped text,
  content json,
  meta json,
  tsv tsvector
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