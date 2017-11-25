import {Datasource} from "../datasource";
import {AbstractRepository} from "../repository";
import {ContentData} from "content.ts";

export interface ContentEntity {
    id: string,
    quillDataId: string,
    quillData: Quill.DeltaStatic,
    title: string,
    tags?: string[],
    lastModifiedAt?: string,
    createdAt?: string
}


export class ContentRepository extends AbstractRepository {
    constructor (sqlTemplate: Datasource) {
        super('user_content_id_seq', sqlTemplate);
    }

    loadUserContentEntity (username: string, userId) {

    }

    async getUserContent (username: string): Promise<ContentData[]> {
        return new Promise<ContentData[]>((resolve, reject) => {
            (async () => {
                let userContentResult;

                try {
                    userContentResult = await this.sqlTemplate.query({
                        text: `
                          SELECT u.id AS user_id, c.*
                          FROM (SELECT id,
                                  unnest(u.created_content_ids) AS content_id
                                FROM tu.user u
                                WHERE u.username = $1) u
                            JOIN tu.user_content c ON c.id = u.content_id;
                        `,
                        values: [username]
                    });
                } catch (e) {
                    return reject(e);
                }

                let contentDescriptionList: ContentData[] = userContentResult.rows.map((row) => {
                    return {
                        id: row.id,
                        quillDataId: row.content_data_id,
                        title: row.title,
                        tags: row.tags,
                        lastModifiedAt: row.last_modified_at,
                        createdAt: row.created_at
                    };
                });

                resolve(contentDescriptionList);
            })();
        });
    }

    async loadUserContent (username: string, contentId: string): Promise<ContentEntity> {
        return new Promise<ContentEntity>(((resolve, reject) => {
            (async () => {
                try {
                    let result = await this.sqlTemplate.query({
                        text: `SELECT c.*, q.id AS quill_data_id,
                                 q.editor_json FROM
                                 tu.user_content c LEFT JOIN tu.quill_data q
                                   ON q.id = c.content_data_id WHERE c.id = $1`,
                        values: [contentId]
                    });

                    let contentResult = result[0];

                    resolve({
                        id: contentResult.id,
                        quillDataId: contentResult.quill_data_id,
                        quillData: contentResult.editor_json,
                        title: contentResult.title,
                        lastModifiedAt: contentResult.last_modified_at,
                        createdAt: contentResult.created_at
                    });
                } catch (e) {
                    reject(e);
                }
            })();
        }));
    }

    async createContent (content: ContentData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    await this.sqlTemplate.query({
                        text: `
                            INSERT INTO tu.user_content (id, content_data_id, title, tags)
                            VALUES($1, $2, $3, $4)
                        `,
                        values: [
                            content.id,
                            content.quillDataId,
                            content.title,
                            content.tags ? content.tags : [],
                        ]
                    });
                    resolve();
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    saveContent (contentEntity: ContentEntity): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    await this.sqlTemplate.query({
                        // language=PostgreSQL
                        text: `
                          UPDATE tu.user_content SET
                            title            = $1,
                            last_modified_at = $2 WHERE id = $3
                        `,
                        values: [contentEntity.title, new Date().toISOString(), contentEntity.id]
                    });
                    resolve();
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }
}

