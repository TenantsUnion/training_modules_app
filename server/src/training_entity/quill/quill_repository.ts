import {Datasource} from '../../datasource';
import {getLogger} from "../../log";
import {AbstractRepository, getUTCNow} from "../../repository";
import {LoggerInstance} from 'winston';
import {QuillEditorData} from '../../../../shared/quill_editor';


export class QuillRepository extends AbstractRepository {
    logger: LoggerInstance;

    constructor (sqlTemplate: Datasource) {
        super('quill_data_id', sqlTemplate);
        this.logger = getLogger('dbLog', 'error');
    }

    async loadQuillData (id: string | number): Promise<QuillEditorData> {
        let result = await this.sqlTemplate.query({
            text: `SELECT * FROM tu.quill_data WHERE id = $1`,
            values: [id]
        });
        return result[0];
    }

    async loadMultipleQuillData (ids: (string | number)[]): Promise<QuillEditorData[]> {
        let result = await this.sqlTemplate.query({
            text: `SELECT * FROM tu.quill_data q WHERE
                          q.id = ANY ($1)`,
            values: [ids]
        });
        return result;
    }

    async insertEditorJson (editorJson: Quill.DeltaStatic): Promise<string> {
        let quillId = await this.getNextId();
        await this.sqlTemplate.query({
            text: `INSERT INTO tu.quill_data (id, editor_json, last_modified_at, created_at)
                        VALUES ($1, $2, $3, $3)`,
            values: [quillId, editorJson, getUTCNow()]
        });
        return quillId;
    }

    async updateEditorJson (quillData: QuillEditorData): Promise<void> {
        await this.sqlTemplate.query({
            text: `UPDATE tu.quill_data SET editor_json = $1, last_modified_at = $2, version = $3
                          WHERE id = $4`,
            values: [quillData.editorJson, getUTCNow(), quillData.version, quillData.id]
        });
    }

    async remove (quillId: string): Promise<void> {
        await this.sqlTemplate.query({
            text: `DELETE from tu.quill_data q where q.id = $1`,
            values: [quillId]
        });
    }
}

