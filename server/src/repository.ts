import {Datasource} from "./datasource";
import {LoggerInstance} from 'winston';

export abstract class AbstractRepository {
    protected logger:LoggerInstance;

    constructor(private sequenceName: string,
                protected sqlTemplate: Datasource) {
        this.sequenceName = sequenceName;
    }

    async getNextId(): Promise<string> {
        let id = await this.sqlTemplate.query({
            text: ` SELECT nextval('tu.${this.sequenceName}')`,
            values: []
        });
        return '' + id[0].nextval;
    };

    async getNextIds(count: number): Promise<string[]> {
        let ids = [];
        while(count && count > 0) {
            let id = await this.getNextId();
            ids.push(id);
            count--;
        }
        return ids;
    }
}