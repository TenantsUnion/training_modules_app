# README #

Tenants Union training module application.

* Version: 0.0.1-SNAPSHOT

## Getting Started ##

# Setup #

* Install latest version of node 8.x to build the application and run the server.
    * node version must be compatible
* Install latest version of Postgres 9.6.x
    * Database setup uses Postgres' jsonb(requires v >= 9.5) support for saving
        and querying json structured data
* Get local copy of project`git clone https://github.com/TenantsUnion/training_modules_app.git`
* Run `npm install` in the project to install package.json dependencies
* Run `npm run init_db` to initialize the tu_training database for your local postgres instance
 
### Core Dependencies ###

##### Server #####
* node - async engine
* express - web server
* pg - postgres database client
##### Database #####
* postgres
* postgrator - execute and track database migrations
##### Front End #####
* vue -
* axios
* foundation
