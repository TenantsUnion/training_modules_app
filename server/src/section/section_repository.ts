import {AbstractRepository} from '../repository';
import {Datasource} from '../datasource';
import {CreateSectionData, SaveSectionData} from '../../../shared/sections';
import {getLogger} from '../log';

export class SectionRepository extends AbstractRepository {
    logger = getLogger('SectionRepository', 'info');

    constructor(sqlTemplate: Datasource) {
        super('section_id_seq', sqlTemplate);
    }

    async createSection(data: CreateSectionData, quillId: string): Promise<string> {
        let sectionId = await this.getNextId();
        await this.sqlTemplate.query({
            text: ` INSERT INTO tu.section (id, title, description, ordered_content_ids)
                             VALUES ($1, $2, $3, ARRAY[$4::bigint])`,
            values: [sectionId, data.title, data.description, quillId]
        });
        return sectionId;
    }

    async updateSection(data: SaveSectionData): Promise<void> {
        await this.sqlTemplate.query({
            text: `UPDATE tu.section s SET title = $1, description = $2, time_estimate = $3, last_modified = $4
                        WHERE s.id = $5`,
            values: [data.title, data.description, data.timeEstimate, new Date(), data.id]
        });
    }

    async remove(sectionId: string): Promise<void> {
        await this.sqlTemplate.query({
            text: `DELETE FROM tu.section s where s.id = $1`,
            values: [sectionId]
        });
    }
}