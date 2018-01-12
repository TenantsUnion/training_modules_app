import {AbstractRepository} from '../../repository';
import {Datasource} from '../../datasource';
import {CreateSectionEntityPayload, SaveSectionEntityPayload, SectionEntity} from '../../../../shared/sections';
import {getLogger} from '../../log';
import {ContentQuestionIdsObj} from '../../training_entity/training_entity_handler';
import {ContentQuestionEntity} from '../../../../shared/training_entity';

export class SectionRepository extends AbstractRepository {
    logger = getLogger('SectionRepository', 'info');

    constructor(sqlTemplate: Datasource) {
        super('section_id_seq', sqlTemplate);
    }

    async createSection(data: CreateSectionEntityPayload, contentQuestionIds: ContentQuestionEntity): Promise<string> {
        let sectionId = await this.getNextId();
        let {title, description, timeEstimate} = data;
        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = contentQuestionIds;
        await this.sqlTemplate.query({
            text: ` INSERT INTO tu.section (id, title, description, time_estimate,
                        ordered_content_ids, ordered_question_ids, ordered_content_question_ids)
                             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            values: [sectionId, title, description, timeEstimate,
                        orderedContentIds, orderedQuestionIds, orderedContentQuestionIds]
        });
        return sectionId;
    }

    async updateSection(data: SectionEntity): Promise<void> {
        let {id, title, description, timeEstimate, active, orderedContentIds} = data;
        await this.sqlTemplate.query({
            text: `
                UPDATE tu.section s SET title = $1, description = $2, time_estimate = $3,  active = $4
                    ordered_content_ids = $5, ordered_content_question_ids = $5, last_modified_at = $6
                       WHERE s.id = $7`,
            values: [title, description, timeEstimate, active, orderedContentIds, new Date(), id]
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