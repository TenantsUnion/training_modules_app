const config = require('config');
const {Pool} = require('pg');

const pool = new Pool({
    user: config("database.db_user"),
    password: config("database.db_password"),
    host: config("database.db_host"),
    port: config("database.db_port"),
    database: config("database.db")
});

pool.on('error', (err, client) => {
    console.log('Unexpected error on idle client: ', err);
});

/**
 * Interface for parameterized queries using node-postgres apis.
 * @see https://node-postgres.com/features/queries
 * e.g:
 *  const query = {
 *      text: 'INSERT INTO users(name, email) VALUES($1, $2)',
 *      values: ['brianc', 'brian.m.carlson@gmail.com'],
 *  }
 */
interface IQueryConfig {
    text: string,
    values: string[]
}

declare type ParameterizedSql = string | IQueryConfig;
declare type SqlParameters = string | number[]

export class Datasource {
    private transactionClient: any = null;

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

    query(sql: ParameterizedSql, parameters?: SqlParameters): any {
        return this.isTransactionInProgress() ?
            this.transactionQuery(sql, parameters) :
            this.pool.query(sql, parameters);
    }
}

process.on('exit', function () {
    (async () => {
        console.log('Closing database pool...');
        await pool.end();
        console.log('Database pool closed');
    })();
    console.log('Ending database process exit handler');
});

export const datasource = new Datasource(pool);
