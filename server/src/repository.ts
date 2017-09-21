import {Datasource} from "./datasource";

export abstract class AbstractRepository {
    constructor (private sequenceName: string,
                 protected sqlTemplate: Datasource) {
        this.sequenceName = sequenceName;
    }

    async getNextId (): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            (async () => {
                try {
                    let id = await this.sqlTemplate.query({
                        // language=PostgreSQL
                        text: ` SELECT nextval('tu.${this.sequenceName}')`,
                        values: []
                    });
                    resolve('' + id[0].nextval);
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

}