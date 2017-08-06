import axios from "axios";
import {CreateUserContentCommand} from "content";
import {
    UserQueryService,
    userQueryService
} from "../../account/user_query_service";

class CreateContentHttpService {
    constructor (private userQueryService: UserQueryService){}

    createContent (title: string, quillContent: any): Promise<void> {
        let createUserContentCommand: CreateUserContentCommand = {
            userId: this.userQueryService.getUserId(),
            title: title,
            quillContent: quillContent
        };
        return axios.post('user/content/create', createUserContentCommand)
            .then((value => {
            })).catch((response => {
                throw response.response.data;
            }))
    }
}

export const createContentHttpService = new CreateContentHttpService(userQueryService);
