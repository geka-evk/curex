
## Description
A test tasks for AYA (parser) 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# import data from /imports/import.txt into Postgres DB
npm run start:import

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Env vars (.env)

```bash
HTTP_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=curex
DB_PASSWORD=dbpassword
DB_NAME=curex-db
DB_SYNCHRONIZE=true
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
