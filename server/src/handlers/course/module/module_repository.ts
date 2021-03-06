import {AbstractRepository, getUTCNow} from "@server/repository";
import {LoggerInstance} from "winston";
import {getLogger} from "@server/log";
import {Datasource} from "@server/datasource";
import {ModuleEntity} from '@shared/modules';

export type ModuleInsertDbData = {
    title: string;
    description?: string;
    timeEstimate?: number;
    active: boolean;
    submitIndividually: boolean;
    headerDataId?: string;
    orderedContentIds: string[];
    orderedQuestionIds: string[];
    orderedContentQuestionIds: string[],
    [p: string]: any
};

export class ModuleRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('ModuleRepository', 'debug');

    constructor (sqlTemplate: Datasource) {
        super('module_id', sqlTemplate);
    }


    async createModule (moduleData: ModuleInsertDbData): Promise<string> {
        let {
            active, title, description, timeEstimate, orderedQuestionIds, orderedContentIds,
            orderedContentQuestionIds, headerDataId, submitIndividually
        } = moduleData;
        let moduleId = await this.getNextId();
        await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              INSERT INTO tu.module (id, title, description, time_estimate, active, ordered_content_ids,
                                     ordered_question_ids, ordered_content_question_ids, last_modified_at, created_at,
                                     header_data_id, submit_individually)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $11)
            `,
            values: [moduleId, title, description, timeEstimate, active, orderedContentIds, orderedQuestionIds,
                orderedContentQuestionIds, getUTCNow(), headerDataId, submitIndividually]
        });
        return moduleId;
    }

    async saveModule (moduleData: ModuleEntity): Promise<void> {
        let {
            title, description, timeEstimate, active, orderedSectionIds, orderedContentIds, orderedQuestionIds,
            orderedContentQuestionIds, id, headerDataId, submitIndividually
        } = moduleData;
        await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              UPDATE tu.module m SET
                title                        = $1,
                description                  = $2,
                time_estimate                = $3,
                active                       = $4,
                header_data_id               = $5,
                ordered_section_ids          = $6,
                ordered_content_ids          = $7,
                ordered_question_ids         = $8,
                ordered_content_question_ids = $9,
                last_modified_at             = $10,
                submit_individually           = $11
              WHERE m.id = $12
            `,
            values: [
                title, description, timeEstimate, active, headerDataId, orderedSectionIds, orderedContentIds,
                orderedQuestionIds, orderedContentQuestionIds, getUTCNow(), submitIndividually, id
            ]
        });
    }

    async updateLastModified (moduleId: string) {
        await this.sqlTemplate.query({
            text: `UPDATE tu.module m SET last_modified_at = $1 WHERE m.id = $2`,
            values: [getUTCNow(), moduleId]
        });
    }

    async addSection (moduleId: string, sectionId: string) {
        await this.sqlTemplate.query({
            text: `UPDATE tu.module SET ordered_section_ids =
                            ordered_section_ids || $1 :: TEXT WHERE id = $2`,
            values: [sectionId, moduleId]
        });
    }

    async loadModuleEntity (moduleId: string): Promise<ModuleEntity> {
        let results = await this.sqlTemplate.query({
            text: `SELECT * from tu.module m where m.id = $1`,
            values: [moduleId]
        });

        return results[0];
    }
}