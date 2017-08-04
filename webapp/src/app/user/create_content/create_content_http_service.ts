import axios from "axios";
import {CreateUserContentCommand} from "content";

class CreateContentHttpService {

    createContent(createUserContentCommand: CreateUserContentCommand): Promise<void> {
        return axios.post('user/content/create', createUserContentCommand)
            .then((value => {
            })).catch((response => {
                throw response.response.data;
            }))
    }
}
export const createCourseHttpService = new CreateContentHttpService();
