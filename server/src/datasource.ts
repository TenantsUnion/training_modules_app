import {traverseSnakeToCamelCase} from './util/snake_to_camel_case_util';
import {moment} from '@shared/normalize_imports';
import {getLogger} from './log';
import {Pool, types} from 'pg';
import {DatabaseConfig} from './config/normalize_config';
import {Moment} from 'moment';
import {TIMESTAMP_FORMAT} from './repository';
import DeltaOperation = Quill.DeltaOperation;

/**
 * Interface for parameterized queries using node-postgres apis.
 * @see https://node-postgres.com/features/queries
 * e.g:
 *  const query = {
 *      text: 'INSERT INTO users(name, email) VALUES($1, $2)',
 *      values: ['brianc', 'brian.m.carlson@gmail.com'],
 *  }
 */
export interface IQueryConfig {
    text: string,
    values: (string | number | boolean | number | (number | string)[] | string[] | number[] | Quill.DeltaStatic
        | { ops: DeltaOperation[] } | Date | Moment | {})[]
}

declare type ParameterizedSql = string | IQueryConfig;
declare type SqlParameters = string[]

export class Datasource {
    private logger = getLogger('Datasource', 'error');
    private transactionClient: any = null;
    private convertPropertiesToCamelCase = traverseSnakeToCamelCase;

    constructor (private pool: Pool) {
    }

    async startTransaction (): Promise<void> {
        this.transactionClient = await this.pool.connect();
        await this.transactionClient.query('BEGIN');
    }

    async transactionQuery (sql: ParameterizedSql, parameters?: SqlParameters): Promise<void> {
        if (!this.isTransactionInProgress()) {
            throw new Error('No transaction in progress to add query to ');
        }

        try {
            await this.transactionClient.query(sql, parameters);
        } catch (e) {
            this.logger.error('Error executing sql ' + sql);
            await this.transactionClient.query('ROLLBACK');
            this.logger.error('Rolled back client');
            this.transactionClient.release();
            this.logger.error('Released client');
            throw e;
        }
    }

    async commitTransaction (): Promise<void> {
        if (!this.isTransactionInProgress()) {
            throw new Error('No transaction in progress to add query to ');
        }

        try {
            await this.transactionClient.query('COMMIT');
        } catch (e) {
            this.logger.error('Error committing transaction');
            this.logger.error(e);
            this.logger.error('Rolled back client');
            this.transactionClient.release();
            this.logger.error('Released client');
            throw e;
        }
    }

    isTransactionInProgress (): boolean {
        return !!this.transactionClient;
    }

    async query (sql: ParameterizedSql, parameters?: SqlParameters): Promise<any> {
        try {
            let queryResult = await (this.isTransactionInProgress() ?
                this.transactionQuery(sql, parameters) : this.pool.query(<string>sql, parameters));

            return queryResult && this.processRows(queryResult.rows);
        } catch (e) {
            let sqlString = typeof sql === 'string' ? sql : (<IQueryConfig> sql).text;
            this.logger.error(`error executing sql statement: ${sqlString}`);
            this.logger.error(`error: ${e}\n${e.stack}`);
            throw e;
        }
    }

    processRows (result: any[]): any[] {
        return this.convertPropertiesToCamelCase(result);
    }
}

const isDateString = (obj: any): boolean => {
    return null;
};

const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
let zoneOffsetRegex = /(-\d\d)$/;

types.setTypeParser(TIMESTAMPTZ_OID, function (val) {
    // postgres timestamp format only show hour offset add ':00' afterwards to more closely match standard ISO 8601 format
    // that moment uses
    // when returning a date field that is in a jsonb object it is YYYY-MM-DDTHH:mm:ss.SSS-ZZ
    // if fractional second of SSS ends in zero it is left off by postgres but kept by moment, add the 0 back on to match moment
    // length is 26 if not round down fractional of second
    if (!val) {
        return val;
    }
    // postgres format is YYYY-MM-DD HH:mm:ss.[SSS]-ZZ when dates
    let paddedFractionalSecond = val.substring(20, val.length - 3).padEnd(3, '0');
    return [
        val.substring(0, 10), "T", val.substring(11, 20), paddedFractionalSecond,
        val.substring(val.length - 3), ':00'
    ].join('');
});

types.setTypeParser(TIMESTAMP_OID, function (val) {
    // leave as string
    return val;
});

const JSON_OID = 114;
const JSONB_OID = 3802;
//2018-01-31T12:30:01.1-08:00
const pgTimestampIsoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\./;
const jsonDateFormatFn = function (key, val) {
    return typeof val === 'string' && pgTimestampIsoRegex.test(val) ? moment(val).utc().format(TIMESTAMP_FORMAT) : val;
};
types.setTypeParser(JSON_OID, function (val) {
    return JSON.parse(val, jsonDateFormatFn);
});
types.setTypeParser(JSONB_OID, function (val) {
    return JSON.parse(val, jsonDateFormatFn);
});


const pool = new Pool(DatabaseConfig);

let logger = getLogger('PgPool', 'info');

pool.on('error', (err, client) => {
    logger.log('error', `Unexpected error on idle client: ${err}\n${err.stack}`);
});

// set
pool.on('connect', (client) => {
    client.query('SET DATESTYLE = iso');
    client.query('SET TIMEZONE to \'UTC\'');
});


pool.on('error', (err, client) => {
    logger.log('error', `Unexpected error on idle client: ${err}\n${err.stack}`);
});

// keep track of whether exit handler has been added so multiple exit handlers are not leaked
// if this module keeps being imported as part of different child processes (i.e. mocha watch)
if (!(<any>global).addedCloseDbHandler) {
    logger.info('Adding process exit close database handler');
    process.on('exit', async function () {
        logger.log('info', 'Closing database pool...');
        await pool.end();
        logger.log('info', 'Database pool closed');
        logger.log('info', 'Ending database process exit handler');
    });

    (<any>global).addedCloseDbHandler = true;
}

export const postgresDb = new Datasource(pool);
