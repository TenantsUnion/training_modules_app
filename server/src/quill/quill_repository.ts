import {Datasource, datasource} from '../datasource';
import {getLogger} from "../log";
import {AbstractRepository} from "../repository";

export interface QuillEditorData {
    id: string;
    editor_json: string;
}

class QuillRepository extends AbstractRepository {
    logger: any;

    constructor (sqlTemplate: Datasource) {
        super('quill_data_id_seq', sqlTemplate);
        this.logger = getLogger('dbLog', 'error');
    }

    async loadEditorJson (id: string): Promise<QuillEditorData> {
        return new Promise<QuillEditorData>((resolve, reject) => {
            (async () => {
                try {
                    let result = this.sqlTemplate.query({
                        text: `SELECT id, editor_json FROM tu.quill_data WHERE
                          id = $1`,
                        values: [id]
                    });

                    resolve(result.rows[0]);
                } catch (e) {
                    this.logger.error('Failed to execute ')
                }
            })();
        });
    }

    async insertEditorJson (quillId: string, editorJson: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    this.sqlTemplate.query({
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

    updateEditorJson (id: string, editorJson: string): Promise<void> {
        return new Promise<void>((reject, resolve) => {
            this.sqlTemplate.query({
                // language=PostgreSQL
                text: `UPDATE tu.quill_data SET editor_json = $1 WHERE
                  id = $2`,
                values: [editorJson, id]
            });
        });
    }
}

export const
    quillRepository = new QuillRepository(datasource);