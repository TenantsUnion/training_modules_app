'use strict';
const path = require('path');
const fs = require('fs');
const pg = require('pg');
const config = require('config');
const Client = pg.Client;
module.exports = {};

module.exports.postgresCient = new Client({
    user: 'postgres',
    password: 'postgres',
    host: config.get("database.db_host"),
    port: config.get("database.db_port"),
    database: 'postgres'
});


module.exports.tuLocalDevClient = new Client({
    user: config.get("database.db_user"),
    password: config.get("database.db_password"),
    host: config.get("database.db_host"),
    port: config.get("database.db_port"),
    database: config.get("database.db")
});

module.exports.getSqlFileAsyncExecutor = async (client, directory) => {
    await client.connect();
    return async (filename, split) => {
        const sqlFileContents = fs.readFileSync(path.resolve(__dirname + directory, filename), 'utf-8');

        console.log('Executing sql file: ' + filename);
        return new Promise(async (resolve, reject) => {
            if (split) {
                let statements = sqlFileContents.split(/;\s*$/m);
                for (let statement of statements) {
                    try {
                        console.log('executing: ' + statement);
                        let response = await client.query(statement);
                        console.log(response);
                        console.log('successfully executed');
                    } catch (e) {
                        console.log('Error');
                        reject(e);
                    }
                }
            } else {
                try {
                    await client.query(sqlFileContents);
                } catch (e) {
                    console.log('Error');
                    reject(e);
                }
            }
            resolve();
        });
    };
};

