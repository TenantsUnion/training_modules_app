import {datasource, Datasource} from "../datasource";
import {AbstractRepository} from "../repository";

export interface ContentEntity {
    id: string,
    quillDataId: string,
    title: string,
    tags?: string[],
    lastModifiedAt?: string,
    createdAt?: string
}

class ContentRepository extends AbstractRepository {
    constructor (sqlTemplate: Datasource) {
        super('content_id_seq', sqlTemplate);
    }

    getUserContentDescriptionList (username: string) {
        this.sqlTemplate.query({
            text: `
                
            `,
            values: []
        })

    }

    loadUserContentEntity (username: string, userId) {

    }


    getUserContent (username: string) {

    }

    loadUserContent (username: string, contentId: string) {

    }

    async createContent (content: ContentEntity): Promise<void> {
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