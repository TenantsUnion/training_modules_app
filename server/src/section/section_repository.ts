import {AbstractRepository} from '../repository';
import {Datasource} from '../datasource';
import {CreateSectionData, SaveSectionData, ViewSectionQuillData} from '../../../shared/sections';
import {getLogger} from '../log';

export class SectionRepository extends AbstractRepository {
    logger = getLogger('SectionRepository', 'info');

    constructor(sqlTemplate: Datasource) {
        super('section_id_seq', sqlTemplate);
    }

    createSection(data: CreateSectionData, quillId:string): Promise<string> {
        return (async () => {
            let sectionId = await this.getNextId();
            await this.sqlTemplate.query({
                // language=POSTGRES-PSQL
                text: ` INSERT INTO tu.section (id, title, description, ordered_content_ids)
                             VALUES ($1, $2, $3, ARRAY[$4::bigint])`,
                values: [sectionId, data.title, data.description, quillId]
            });
            return sectionId;
        })().catch((e) => {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        });
    }

    async updateSection(data: SaveSectionData): Promise<void> {
        return this.sqlTemplate.query({
            text: `UPDATE tu.section s SET title = $1, description = $2, time_estimate = $3, last_modified = $4
                        WHERE s.id = $5`,
            values: [data.title, data.description, data.timeEstimate, data.lastModifiedAt, data.id]
        }).then(() => {
        });
    }
}