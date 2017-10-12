import {AbstractRepository} from "../repository";
import {LoggerInstance} from "winston";
import {getLogger} from "../log";
import {Datasource} from "../datasource";
import {CreateModuleDataHeaderId} from './modules';
import {CreateModuleData} from 'modules';
import {SaveModuleData} from 'modules';
import * as moment from "moment";

export class ModuleRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('ModuleRepository', 'debug');

    constructor(sqlTemplate: Datasource) {
        super('module_id_seq', sqlTemplate);
    }

    async addModule(moduleData: CreateModuleData, headerId: string): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            (async () => {
                try {

                    let courseId = await this.getNextId();
                    await this.sqlTemplate.query({
                        text: `INSERT INTO tu.module (id, title, description, time_estimate, active, header_content) VALUES ($1, $2, $3, $4, $5, $6)`,
                        values: [courseId, moduleData.title, moduleData.description, moduleData.timeEstimate, moduleData.active, headerId]
                    });
                    resolve(courseId);
                } catch (e) {
                    this.logger.log(`Error creating course: ${moduleData.title}`, 'error');
                    this.logger.log(e, 'error');
                    reject(e);
                }
            })();
        });
    }

    async saveModule(moduleData: SaveModuleData): Promise<void> {
            return this.sqlTemplate.query({
                // language=POSTGRES-SQL
                text: `UPDATE tu.module m SET title = $1, description = $2, time_estimate = $3,
                                active = $4, ordered_section_ids = $5
                                    where m.id = $6`,
                values: [moduleData.title, moduleData.description, moduleData.timeEstimate, moduleData.active,
                    moduleData.orderedSectionIds, moduleData.id]
            }).then(() => {});
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

    addSection(moduleId: string, sectionId: string) {
        return (async () => {
            await this.sqlTemplate.query({
                text: `UPDATE tu.module SET ordered_section_ids =
                            ordered_section_ids || $1 :: BIGINT WHERE id = $2`,
                values: [sectionId, moduleId]
            });
        })().catch((e) => {
            this.logger.error(`Failed to add section for moduleId: ${moduleId}, sectionId: ${sectionId}`);
            this.logger.error(`Exception:\n${e}`);
        });
    }
}