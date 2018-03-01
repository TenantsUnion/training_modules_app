import {Datasource} from "../datasource";
import {getUTCNow} from "../repository";

export type SectionProgressIds = {
    sectionIds: string[];
    userId: string;
}

export class SectionProgressRepository {
    constructor (protected sqlTemplate: Datasource) {
    }

    async createSectionProgress ({userId, sectionIds}: SectionProgressIds) {
        if(!sectionIds || !sectionIds.length) {
            return;
        }
        let time = getUTCNow();
        let insertColumnsSql = 'INSERT INTO tu.section_progress (user_id, section_id, last_modified_at, created_at) values ';

        return this.sqlTemplate.query({
            text: insertColumnsSql + sectionIds.map((id, index) => `($1, $${index + 3}, $2, $2)`).join(','),
            values: [userId, time, ...sectionIds]
        });
    }

    async loadSectionProgress ({userId, sectionId}: {userId: string, sectionId: string}) {
        let results = await this.sqlTemplate.query({
            text: `SELECT * FROM tu.section_progress sp WHERE sp.user_id = $1 AND sp.section_id = $2`,
            values: [userId, sectionId]
        });
        return results[0];
    }
}
