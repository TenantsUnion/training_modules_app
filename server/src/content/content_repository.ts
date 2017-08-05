import {datasource, Datasource} from "../datasource";

class ContentRepository {
    constructor (private sqlTemplate: Datasource) {
    }

    getUserContentDescriptionList(username:string){
        this.sqlTemplate.query({
            text: `
            
            `,
            values: []
        })

    }

    loadUserContentEntity(username:string, userId){

    }


    getUserContent(username: string) {

    }

    loadUserContent(username: string, contentId: string) {

    }
}

export const contentRepository = new ContentRepository(datasource);