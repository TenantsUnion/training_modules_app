import {traverseSnakeToCamelCase} from './util/snake_to_camel_case_util';
import {Moment} from 'moment';
import {getLogger, LOG_LEVELS} from './log';
import {Pool, QueryResult} from 'pg';

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
    values: (string | number | boolean | number | (number | string)[] | string[] | number[] | Quill.DeltaStatic | Date | Moment)[]
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

            return  queryResult && this.processRows(queryResult.rows);
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
