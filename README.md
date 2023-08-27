
## Description
`curex-app` is test task for AYA to parse file with indents, and import parsed data into PostgreSQL.

[File format example](imports/import.txt)

The logic for parsing a file is in `./src/db/file-importer`

## Installation

```bash
$ npm install
```

## Running the app

```bash
# import data from /imports/import.txt into Postgres DB
$ npm run start:import

# run curex-app (with DB and adminer)
$ docker-compose up

# run server locally
$ npm run start:dev
```

## Env vars (.env)

```bash
HTTP_PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=curex
DB_PASSWORD=dbpassword
DB_NAME=curex-db
DB_SYNCHRONIZE=true
```

## API docs (Swagger)
  Url to try existing endpoints: `localhost:3000/api-docs`


## Answers

1. _How to change the code to support different file format versions?_ 


   For handling different file formats I'd suggest creating separate classes, which implement `IDocument`,
   and `FileImporter` will use (see method _makeJsonFromText_) needed instances of `IDocument` through `documentFactory`.
   Version of the format could be identified dynamically (based on content), or passed as param to the factory.
   `DbImportService` is responsible for actual storing data in DB, and doesn't know anything about file format     
---

2. _How will the import system change if in the future we need to get this data from a web API?_


   I don't see a necessity to change import system in case getting the file content through API.
   Reading file from disk OR receiving it from API are just "transport details" in scope of parsing. 
   `FileImporter` doesn't know where from content to parse is coming. It has 2 methods:
    
   - _makeJsonFromText( content )_ - "Main" method for parsing raw file content, and convert it in JSON structure, which holds
     information about domain entities to be stored in DB;

   - _importFromFile( fileName? )_ - Which accepts fileName (if not passed, used default name), read file from disk, and call
     the makeJsonFromText() method  

   Current implementation has 3 methods to import data to DB:
   
   - using script: `npm run start:import`, which reads file from disk, parse it and store in DB (without spinning up http-server)
   - `GET localhost:3000/db/import?filename=import.txt`, which accepts optional _filename_, and does the same as script above
   - `POST localhost:3000/db/import-file`, which accepts fileContent as _form-data_ 

     https://i.imgur.com/yKvgJcy.png


