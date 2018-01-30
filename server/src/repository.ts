import * as Moment from 'moment';
import {Datasource} from "./datasource";
import {LoggerInstance} from 'winston';

export abstract class AbstractRepository {
    protected logger: LoggerInstance;

    constructor (private idFnName: string,
                 protected sqlTemplate: Datasource) {
    }

    async getNextId (): Promise<string> {
        const text = `SELECT tu."${this.idFnName}"(1) AS id;`;
        let result = await this.sqlTemplate.query(text);
        return result[0].id;
    };


    async getNextIds (count: number): Promise<string[]> {
        const text = `SELECT tu."${this.idFnName}"(${count}) AS id;`;
        let result = await this.sqlTemplate.query(text);
        return result.map((row) => row.id);
    }
}

export const getUTCNow = (): string => {
    return Moment().format(TIMESTAMP_FORMAT);
};

export const TIMESTAMP_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
export const toDbTimestampFormat = (date: Date): string => {
    return Moment(date).format(TIMESTAMP_FORMAT);
};
