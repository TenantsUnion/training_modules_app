import {datasource, Datasource} from "../datasource";
import {AbstractRepository} from "../repository";

export interface ContentEntity {
    id: string,
    quillData: Quill.DeltaStatic,
    title: string,
    tags?: string[],
    lastModifiedAt?: string,
    createdAt?: string
}

export interface ContentDescriptionEntity {
    id: string;
    quillDataId: string;
    title: string;
    tags?: string[],
    lastModifiedAt?: string,
    createdAt?: string
}

class ContentRepository extends AbstractRepository {
    constructor (sqlTemplate: Datasource) {
        super('content_id_seq', sqlTemplate);
    }

    loadUserContentEntity (username: string, userId) {

    }

    async getUserContent (username: string): Promise<ContentDescriptionEntity[]> {
        return new Promise<ContentDescriptionEntity[]>((resolve, reject) => {
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
                            JOIN tu.content c ON c.id = u.content_id;
                        `,
                        values: [username]
                    });
                } catch (e) {
                    return reject(e);
                }

                let contentDescriptionList: ContentDescriptionEntity[] = userContentResult.rows.map((row) => {
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

    loadUserContent (username: string, contentId: string) {

    }

    async createContent (content: ContentDescriptionEntity): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    await this.sqlTemplate.query({
                        text: `
                            INSERT INTO tu.content (id, content_data_id, title, tags)
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
}

export const contentRepository = new ContentRepository(datasource);