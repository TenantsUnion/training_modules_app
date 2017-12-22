import {AbstractRepository} from '../../repository';
import {Datasource} from '../../datasource';
import {CreateSectionEntityPayload, SaveSectionEntityPayload, SectionEntity} from '../../../../shared/sections';
import {getLogger} from '../../log';

export class SectionRepository extends AbstractRepository {
    logger = getLogger('SectionRepository', 'info');

    constructor(sqlTemplate: Datasource) {
        super('section_id_seq', sqlTemplate);
    }

    async createSection(data: CreateSectionEntityPayload, quillIds: string[]): Promise<string> {
        let sectionId = await this.getNextId();
        await this.sqlTemplate.query({
            text: ` INSERT INTO tu.section (id, title, description, time_estimate, ordered_content_ids, ordered_content_question_ids)
                             VALUES ($1, $2, $3, $4, $5, $5)`,
            values: [sectionId, data.title, data.description, data.timeEstimate, quillIds]
        });
        return sectionId;
    }

    async updateSection(data: SectionEntity): Promise<void> {
        let {id, title, description, timeEstimate, orderedContentIds} = data;
        await this.sqlTemplate.query({
            text: `UPDATE tu.section s SET title = $1, description = $2, time_estimate = $3, last_modified_at = $4,
                        ordered_content_ids = $5, ordered_content_question_ids = $5
                   WHERE s.id = $6`,
            values: [title, description, timeEstimate, new Date(), orderedContentIds, id]
        });
    }

    async loadSection(id): Promise<SectionEntity> {
        let results = await this.sqlTemplate.query({
            text: `SELECT * from tu.section s WHERE s.id = $1`,
            values: [id]
        });

        return results[0];
    }

    async remove(sectionId: string): Promise<void> {
        await this.sqlTemplate.query({
            text: `DELETE FROM tu.section s where s.id = $1`,
            values: [sectionId]
        });
    }
}