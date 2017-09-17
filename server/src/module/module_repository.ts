import {AbstractRepository} from "../repository";
import {CreateModuleData} from "../../../shared/modules";
import {LoggerInstance} from "winston";
import {getLogger} from "../log";
import {Datasource} from "../datasource";

export class ModuleRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('ModuleRepository', 'debug');


    constructor (sqlTemplate: Datasource) {
        super('module_id_seq', sqlTemplate);
    }

    async addModule (moduleData: CreateModuleData) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            (async () => {
                try {

                    let courseId = await this.getNextId();
                    await this.sqlTemplate.query({
                        text: `INSERT INTO tu.module (id, title, description, time_estimate, active) VALUES ($1, $2, $3, $4, $5)`,
                        values: [courseId, moduleData.title, moduleData.description, moduleData.timeEstimate, false]
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
}