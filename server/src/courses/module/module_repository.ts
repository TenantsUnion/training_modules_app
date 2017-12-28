import {AbstractRepository} from "../../repository";
import {LoggerInstance} from "winston";
import {getLogger} from "../../log";
import {Datasource} from "../../datasource";
import {CreateModuleEntityPayload, ModuleEntity} from 'modules.ts';
import {SaveModuleEntityPayload} from 'modules.ts';
import * as moment from "moment";

export class ModuleRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('ModuleRepository', 'debug');

    constructor(sqlTemplate: Datasource) {
        super('module_id_seq', sqlTemplate);
    }

    async addModule(moduleData: CreateModuleEntityPayload, quillIds: string[]): Promise<string> {
        let {active, title, description, timeEstimate} = moduleData;
        try {
            let moduleId = await this.getNextId();
            await this.sqlTemplate.query({
                text: `INSERT INTO tu.module (id, title, description, time_estimate, active, ordered_content_ids, ordered_content_question_ids)
                                    VALUES ($1, $2, $3, $4, $5, $6, $6)`,
                values: [moduleId, title, description, timeEstimate, active, quillIds]
            });
            return moduleId;
        } catch (e) {
            this.logger.log(`Error creating module: ${moduleData.title}`, 'error');
            this.logger.log('error', e);
            throw e;
        }
    }

    async saveModule(moduleData: ModuleEntity): Promise<void> {
        let {title, description, timeEstimate, active, orderedSectionIds, orderedContentIds, orderedContentQuestionIds, id} = moduleData;
        await this.sqlTemplate.query({
            text: `
                UPDATE tu.module m SET title = $1, description = $2, time_estimate = $3, active = $4,
                    ordered_section_ids = $5, ordered_content_ids = $6, ordered_content_question_ids = $6,
                    last_modified_at = $7
                        where m.id = $8`,
            values: [title, description, timeEstimate, active, orderedSectionIds, orderedContentIds, new Date(), id]
        });
    }

    updateLastModified(moduleId: string): Promise<string> {
        const lastModified = moment.utc();
        let query = {
            text: `UPDATE tu.module m SET last_modified_at = $1 WHERE m.id = $2`,
            values: [lastModified, moduleId]
        };
        return this.sqlTemplate.query(query).then(() => {
            return lastModified.toISOString();
        });
    }

    async addSection(moduleId: string, sectionId: string) {
        await this.sqlTemplate.query({
            text: `UPDATE tu.module SET ordered_section_ids =
                            ordered_section_ids || $1 :: BIGINT WHERE id = $2`,
            values: [sectionId, moduleId]
        });
    }

    async loadModule(moduleId: string): Promise<ModuleEntity> {
        let results = await this.sqlTemplate.query({
            text: `SELECT * from tu.module m where m.id = $1`,
            values: [moduleId]
        });

        return results[0];
    }
}