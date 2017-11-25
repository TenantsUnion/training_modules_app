import {Datasource} from '../datasource';
import {getLogger} from "../log";
import {AbstractRepository} from "../repository";
import {LoggerInstance} from 'winston';
import * as moment from 'moment';
import * as _ from 'underscore';
import {Moment} from 'moment';
import {QuillEditorData} from '../../../shared/quill_editor';


export class QuillRepository extends AbstractRepository {
    logger: LoggerInstance;

    constructor(sqlTemplate: Datasource) {
        super('quill_data_id_seq', sqlTemplate);
        this.logger = getLogger('dbLog', 'error');
    }

    async loadEditorJson(id: string): Promise<QuillEditorData> {
        try {
            let result = await this.sqlTemplate.query({
                text: `SELECT id, editor_json FROM tu.quill_data WHERE
                          id = $1`,
                values: [id]
            });
            return result[0];
        } catch (e) {
            this.logger.error('Failed to execute ')
        }
    }

    async insertEditorJson(quillId: string, editorJson: Quill.DeltaStatic): Promise<void> {
        await this.sqlTemplate.query({
            text: `INSERT INTO tu.quill_data (id, editor_json)
                        VALUES ($1, $2)`,
            values: [quillId, editorJson]
        });
    }

    async updateEditorJson(id: string, editorJson: Quill.DeltaStatic): Promise<void> {
        await this.sqlTemplate.query({
            text: `UPDATE tu.quill_data SET
                          editor_json = $1,
                           last_modified_at = $2 WHERE
                          id = $3`,
            values: [editorJson, new Date(), id]
        });
    }

    async remove(quillId: string): Promise<void> {
        await this.sqlTemplate.query({
            text: `DELETE from tu.quill_data q where q.id = $1`,
            values: [quillId]
        });
    }
}

