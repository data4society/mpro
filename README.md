# Monitoring Pro [![Build Status](https://travis-ci.org/data4society/mpro.svg?branch=master)](https://travis-ci.org/data4society/mpro)

Monitoring PRO is a tool for search, attribution and extracting data from the incoming web-resources, as well as a tool for further analysis of this data.

# Install

Clone the repo

```bash
git clone https://github.com/data4society/mpro.git
```

Install dependencies

```bash
npm install 
```

Seed the db

```bash
npm run seed
```

# Run application

If you run tests before, tehn you should seed the db again

```bash
npm run seed
```

Start application

```bash
npm run start
```

Open page in your browser:

```bash
http://localhost:5000
```

# Run tests

```bash
npm test
```

You have to run PostgreSQL locally or provide external connection url (keep in mind that test will reset your db).

By default application will expect database `mpro` with user `mpro_user` and password `mpro_pw` running on `localhost:5432`. However you can change connection string in property `db_url` of configuration file `config/default.json`

# Bundling

Server will serve bundled version of app in production mode. To compile bundle you should run:

```bash
npm run bundle
```