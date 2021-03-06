import {SectionEntity} from '@shared/sections';
import {getLogger} from "@server/log";
import {Datasource} from "@server/datasource";
import {AbstractRepository, getUTCNow} from "@server/repository";

export type SectionInsertDbData = {
    title: string;
    description?: string;
    timeEstimate?: number;
    headerDataId?: string;
    submitIndividually: boolean;
    orderedContentIds: string[];
    orderedQuestionIds: string[];
    orderedContentQuestionIds: string[];
    [p: string]: any;
};

export class SectionRepository extends AbstractRepository {
    logger = getLogger('SectionRepository', 'info');

    constructor (sqlTemplate: Datasource) {
        super('section_id', sqlTemplate);
    }

    async createSection (data: SectionInsertDbData): Promise<string> {
        let sectionId = await this.getNextId();
        let {
            title, description, timeEstimate, orderedContentIds, orderedQuestionIds,
            orderedContentQuestionIds, headerDataId, active, submitIndividually
        } = data;
        await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              INSERT INTO tu.section (
                id, title, description, time_estimate, ordered_content_ids, ordered_question_ids,
                ordered_content_question_ids, created_at, last_modified_at, header_data_id, active, submit_individually)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9, $10, $11)`,
            values: [sectionId, title, description, timeEstimate,
                orderedContentIds, orderedQuestionIds, orderedContentQuestionIds, getUTCNow(), headerDataId, active,
                submitIndividually]
        });
        return sectionId;
    }

    async updateSection (data: SectionEntity): Promise<void> {
        let {
            id, title, description, timeEstimate, active, orderedContentIds, orderedQuestionIds,
            orderedContentQuestionIds, headerDataId, submitIndividually
        } = data;
        await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              UPDATE tu.section s SET
                title                        = $1,
                description                  = $2,
                time_estimate                = $3,
                active                       = $4,
                ordered_content_ids          = $5,
                ordered_question_ids         = $6,
                ordered_content_question_ids = $7,
                last_modified_at             = $8,
                header_data_id               = $9,
                submit_individually          = $10
              WHERE S.id = $11`,
            values: [title, description, timeEstimate, active, orderedContentIds, orderedQuestionIds,
                orderedContentQuestionIds, getUTCNow(), headerDataId, submitIndividually, id]
        });
    }

    async loadSection (id): Promise<SectionEntity> {
        let results = await this.sqlTemplate.query({
            text: `SELECT * from tu.section s WHERE s.id = $1`,
            values: [id]
        });

        return results[0];
    }

    async remove (sectionId: string): Promise<void> {
        await this.sqlTemplate.query({
            text: `DELETE FROM tu.section s where s.id = $1`,
            values: [sectionId]
        });
    }

    async updateLastModified (sectionId: string) {
        await this.sqlTemplate.query({
            text: `UPDATE tu.section s SET last_modified_at = $1 WHERE s.id = $2`,
            values: [getUTCNow(), sectionId]
        });
    }
}