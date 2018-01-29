import {AbstractRepository, getUTCNow} from "../../repository";
import {LoggerInstance} from "winston";
import {getLogger} from "../../log";
import {Datasource} from "../../datasource";
import {ModuleEntity} from '@shared/modules';
import * as moment from "moment";

export type ModuleInsertDbData = {
    title: string;
    description?: string;
    timeEstimate?: number;
    active: boolean;
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
            orderedContentQuestionIds, headerDataId
        } = moduleData;
        let moduleId = await this.getNextId();
        await this.sqlTemplate.query({
            text: `INSERT INTO tu.module (id, title, description, time_estimate, active, ordered_content_ids,
                        ordered_question_ids, ordered_content_question_ids, last_modified_at, created_at, header_data_id)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10)`,
            values: [moduleId, title, description, timeEstimate, active,
                orderedContentIds, orderedQuestionIds, orderedContentQuestionIds, getUTCNow(), headerDataId]
        });
        return moduleId;
    }

    async saveModule (moduleData: ModuleEntity): Promise<void> {
        let {
            title, description, timeEstimate, active, orderedSectionIds, orderedContentIds, orderedQuestionIds,
            orderedContentQuestionIds, id, headerDataId
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
                last_modified_at             = $10
              WHERE m.id = $11
            `,
            values: [
                title, description, timeEstimate, active, headerDataId, orderedSectionIds, orderedContentIds,
                orderedQuestionIds, orderedContentQuestionIds, getUTCNow(), id
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