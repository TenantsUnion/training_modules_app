import {Datasource} from '../datasource';
import {getLogger} from "../log";
import {AbstractRepository} from "../repository";
import {LoggerInstance} from 'winston';
import * as moment from 'moment';
import * as _ from 'underscore';
import {Moment} from 'moment';
import {QuillEditorData} from '../../../shared/quill';


export class QuillRepository extends AbstractRepository {
    logger: LoggerInstance;

    constructor(sqlTemplate: Datasource) {
        super('quill_data_id_seq', sqlTemplate);
        this.logger = getLogger('dbLog', 'error');
    }

    async loadEditorJson(id: string): Promise<QuillEditorData> {
        return new Promise<QuillEditorData>((resolve, reject) => {
            (async () => {
                try {
                    let result = await this.sqlTemplate.query({
                        text: `SELECT id, editor_json FROM tu.quill_data WHERE
                          id = $1`,
                        values: [id]
                    });

                    resolve(result[0]);
                } catch (e) {
                    this.logger.error('Failed to execute ')
                }
            })();
        });
    }

    async insertEditorJson(quillId: string, editorJson: Quill.DeltaStatic): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    await this.sqlTemplate.query({
                        // language=PostgreSQL
                        text: `INSERT INTO tu.quill_data (id, editor_json)
                        VALUES ($1, $2)`,
                        values: [quillId, editorJson]
                    });

                    resolve();
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    async updateEditorJson(id: string, editorJson: Quill.DeltaStatic): Promise<void> {
        return this.sqlTemplate.query({
            text: `UPDATE tu.quill_data SET
                          editor_json = $1,
                           last_modified_at = $2 WHERE
                          id = $3`,
            values: [editorJson, new Date(), id]
        }).then(() => {
        });
    }
}

