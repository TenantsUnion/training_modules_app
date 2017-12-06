'use strict';
const path = require('path');
const fs = require('fs');
import {Client} from 'pg';

const config = require('config');
const logger = require('./script_logger').getLogger('SQL File Executor');
// module.exports = {};

export const postgresClient = () => {
    let client = new Client({
        user: 'postgres',
        password: 'postgres',
        host: config.get("database.db_host"),
        port: config.get("database.db_port"),
        database: 'postgres'
    });
    return client;
};


export const tuLocalDevClient = () => {
    let client = new Client({
        user: config.get("database.db_user"),
        password: config.get("database.db_password"),
        host: config.get("database.db_host"),
        port: config.get("database.db_port"),
        database: config.get("database.db")
    });
    return client;
};


/**
 * Establishes a connection using the {@see pg.Client} library returning an
 * async function for reading and splitting sql queries from a file
 *
 * @note pg.Client can't handle multiple statements at once
 * @param client
 * @param directory
 * @returns {function(*=, *=)}
 */
export const getSqlFileAsyncExecutor = (client, directory) => {
    return async (filename, split) => {
        const sqlFileContents = fs.readFileSync(path.resolve(__dirname + directory, filename), 'utf-8');
        logger.log('info', 'Executing sql file: %s', filename);
        if (split) {
            let statements = sqlFileContents.split(/;\s*$/m);
            for (let statement of statements) {
                try {
                    let response = await client.query(statement);
                } catch (e) {
                    logger.log('error', e);
                    throw e;
                }
            }
            logger.log('info', 'successfully executed sql statements in file');
        } else {
            try {
                await client.query(sqlFileContents);
            } catch (e) {
                logger.log('error', e);
                throw e;
            }
        }
    };
};
