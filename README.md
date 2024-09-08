# sql-browser-query-tool

Inline SQL browser tool to query read-only databases

## Getting started

### Setting up a read-only user

Ensure that the default `postgres` user has superuser permissions:

```bash
psql -d postgres
postgres=# ALTER ROLE postgres superuser;
```

Then, create a database using the superuser first:

```bash
psql -U postgres
postgres=# CREATE DATABASE sql_browser_query_tool;
```

Then, setup a new read-only role in your database:

```bash
postgres=# CREATE ROLE ro_user WITH LOGIN PASSWORD 'root' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION VALID UNTIL 'infinity';
```

Once, that's setup, assign the user the permissions for the new database:

```bash
postgres=# GRANT CONNECT ON DATABASE sql_browser_query_tool TO ro_user;
postgres=# GRANT USAGE ON SCHEMA public TO ro_user;
postgres=# GRANT SELECT ON ALL TABLES IN SCHEMA public TO ro_user;
postgres=# GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO ro_user;
postgres=# \q
```

Afterwards, make sure that the user exists via:

```bash
createdb ro_user
```

Then, verify that the user has the right permissions:

```bash
psql -U ro_user
postgres=# \c sql_browser_query_tool
postgres=# CREATE TABLE foo(id int not null);
ERROR:  permission denied for schema public
LINE 1: create table foo(id int not null);
```

The error is to be expected.

### Installing the project

Clone the repository

```bash
git clone https://github.com/woojiahao/sql-browser-query-tool
```

Setup the `DATABASE_URL`

```bash
mv .env.example .env
```

Install the dependencies

```bash
yarn install
```

Start the application

```bash
yarn start:dev
```