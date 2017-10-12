/**
 * Interface for parameterized queries using node-postgres apis.
 * @see https://node-postgres.com/features/queries
 * e.g:
 *  const query = {
 *      text: 'INSERT INTO users(name, email) VALUES($1, $2)',
 *      values: ['brianc', 'brian.m.carlson@gmail.com'],
 *  }
 */
import {traverseSnakeToCamelCase} from './util/snake_to_camel_case_util';
import {Moment} from 'moment';

export interface IQueryConfig {
    text: string,
    values: (string | number | boolean | number | string[] | number[] | Quill.DeltaStatic | Date | Moment)[]
}

declare type ParameterizedSql = string | IQueryConfig;
declare type SqlParameters = string | string[]

export class Datasource {
    private transactionClient: any = null;
    private convertPropertiesToCamelCase = traverseSnakeToCamelCase;

    constructor(private pool: any) {
    }

    startTransaction(): any {
        (async () => {
            this.transactionClient = await this.pool.connect();
            await this.transactionClient.query('BEGIN');
        })();
    }

    transactionQuery(sql: ParameterizedSql, parameters?: SqlParameters): any {
        if (!this.isTransactionInProgress()) {
            throw new Error('No transaction in progress to add query to ');
        }

        (async () => {
            try {
                await this.transactionClient.query(sql, parameters);
            } catch (e) {
                console.error('Error executing sql ' + sql);
                await this.transactionClient.query('ROLLBACK');
                console.error('Rolled back client');
                this.transactionClient.release();
                console.error('Released client');
                throw e;
            }
        })().catch(e => console.error(e.stack));
    }

    commitTransaction(): any {
        if (!this.isTransactionInProgress()) {
            throw new Error('No transaction in progress to add query to ');
        }

        (async () => {
            try {
                await this.transactionClient('COMMIT');
            } catch (e) {
                console.error('Error committing transaction');
                console.error(e);
                console.error('Rolled back client');
                this.transactionClient.release();
                console.error('Released client');
                throw e;
            }
        })().catch(e => console.error(e.stack));
    }

    isTransactionInProgress(): boolean {
        return !!this.transactionClient;
    }

    query(sql: ParameterizedSql, parameters?: SqlParameters): Promise<any[]> {
        let queryResult = this.isTransactionInProgress() ?
            this.transactionQuery(sql, parameters) :
            this.pool.query(sql, parameters);
        return queryResult.then((result) => {
           return this.processRows(result.rows);
        });
    }

    processRows(result: any[]): any[] {
        return this.convertPropertiesToCamelCase(result);
    }
}
