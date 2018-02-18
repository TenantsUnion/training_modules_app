import {Datasource} from "../../datasource";
import {getUTCNow} from "../../repository";

export type ModuleProgressIds = {
    moduleIds: string[];
    userId: string;
}

export class ModuleProgressRepository {
    constructor (protected sqlTemplate: Datasource) {
    }

    async createModuleProgress ({moduleIds, userId}: ModuleProgressIds) {
        let time = getUTCNow();
        let insertColumnsSql = 'INSERT INTO tu.module_progress (user_id, module_id, last_modified_at, created_at) values ';

        return this.sqlTemplate.query({
            text: insertColumnsSql + moduleIds.map((id, index) => `($1, $${index + 3}, $2, $2)`).join(','),
            values: [userId, time, ...moduleIds]
        });
    }

    async loadModuleProgress ({userId, moduleId}: {userId: string, moduleId: string}) {
        let results = await this.sqlTemplate.query({
            text: `SELECT * FROM tu.module_progress mp WHERE mp.user_id = $1 AND mp.module_id = $2`,
            values: [userId, moduleId]
        });
        return results[0];
    }
}