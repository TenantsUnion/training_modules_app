import axios from "axios";
import {ContentDescriptionEntity, CreateUserContentCommand} from "content";
import {
    UserQueryService,
    userQueryService
} from "../../account/user_query_service";
import {appRouter} from "../../router";

class CreateContentHttpService {
    constructor (private userQueryService: UserQueryService) {
    }

    createContent (title: string, quillContent: any): Promise<void> {
        let username = appRouter.currentRoute.params.username;

        let createUserContentCommand: CreateUserContentCommand = {
            userId: this.userQueryService.getUserId(),
            title: title,
            quillContent: quillContent
        };
        return axios.post(`user/${username}/content/create`, createUserContentCommand)
            .then((value => {
            })).catch((response => {
                throw response.response.data;
            }))
    }

    getContentDescriptionList (): Promise<ContentDescriptionEntity[]> {
        let username = this.userQueryService.getUsername();

        return axios.get(`user/${username}/content`)
            .then((response) => {
                let userContent: ContentDescriptionEntity[] =
                    <ContentDescriptionEntity[]> response.data;

                return userContent;
            })
            .catch((response => {
                throw response.response.data;
            }));
    }
}

export const contentHttpService = new CreateContentHttpService(userQueryService);
