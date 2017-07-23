# Database Migrations

[db-migrate](https://github.com/db-migrate) is used with its
[postgres driver](https://github.com/db-migrate/pg) to create and execute database
sql files to maintain the Tenants Union training module application. 

## Getting Started

After cloning the project run `npm install` to install the db-migrate and db-migrate-pg
dependencies listed in package.json. To run db-migrate from the command line
also install the db-migrate library globally with `npm install -g`.

### db-migrate Configuration

The db-migrate default directory structure configuration is used: the migration javascript
files in the migrations directory from running db-migrate at the root level of the
project, the database.json file is at the root level of the project and up and down .sql files
are automatically created in the /migrations/sqls directory with the timestamp
prepended (for js files as well).
for migrations.

### Creating a migration file


### Running the migrations

### Migrating
### Down migrating

File order:
user_roles


 