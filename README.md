# README #

Tenants Union training module application. 
[![Build Status](https://travis-ci.org/TenantsUnion/training_modules_app.svg?branch=master)](https://travis-ci.org/TenantsUnion/training_modules_app)

### Getting Started

#### Setup

* Install current version of node 8.x to build the application and run the server.
    * Application's asynchronous logic relies on async await functionality of v8.x
    * [Download Current Node v8.x](https://nodejs.org/en/download/current/)
* Install Postgres 9.6.x for persisting and querying application data
    * Application uses Postgres' jsonb(requires v >= 9.5) support for saving
        and querying json structured data
    * [Download Postgres](https://www.postgresql.org/download/)
* Get local copy of project: 

            git clone https://github.com/TenantsUnion/training_modules_app.git
* Install dependencies:

            npm install
* Initialize database
(scripts run with default postgres install account configured in [sql\_file\_executor.js](./bin/sql_file_executor.js)):

            npm run init_db
* Develop with live reload:

            npm run watch-dev
* See the scripts section of [package.json](./package.json) for more build and run configurations.

 
#### Core Dependencies

##### Server
* node - async engine
* express - web server
* pg - postgres database client
##### Database
* postgres
* postgrator - execute and track database migrations
##### Front End
* [vuejs](https://vuejs.org/) - core component architecture and page routing
    * [vue-form](https://www.npmjs.com/package/vue-form) - input validation and error messages
    * [vue-class-component](https://www.npmjs.com/package/vue-class-component) - es6 classes and decorators for vue components
* axios - asynchronous http requests to browser
* foundation

