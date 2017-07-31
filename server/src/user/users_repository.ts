import {Datasource, datasource} from "../datasource";



export class UserRepository {
    constructor(private datasource: Datasource){

    }


}


export const userRepository = new UserRepository(datasource);
