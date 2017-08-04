import {datasource, Datasource} from "../datasource";

class ContentRepository {
    constructor (private sqlTemplate: Datasource) {
    }


}

export const contentRepository = new ContentRepository(datasource);