import axios from "axios";
import {ContentData, CreateUserContentCommand} from "content";
import {
    UserQueryService,
    userQueryService
} from "../../account/user_query_service";
import {appRouter} from "../../router";
import {ContentEntity} from "../../../../../server/src/content/content_repository";

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

    getContentDescriptionList (): Promise<ContentData[]> {
        let username = this.userQueryService.getUsername();

        return axios.get(`user/${username}/content`)
            .then((response) => {
                let userContentDescriptionList: ContentData[] =
                    <ContentData[]> response.data;

                return userContentDescriptionList;
            })
            .catch((response) => {
                throw response.response.data;
            });
    }

    loadContent (contentId:string) : Promise<ContentEntity> {
        let username = this.userQueryService.getUsername();

        return axios.get(`user/${username}/contentId/${contentId}`)
            .then((response) => {
                let userContent: ContentEntity =
                    <ContentEntity> response.data;

                return userContent;
            })
            .catch((response) => {
                throw response.response.data;
            });
    }

    saveContent (content: ContentEntity) : Promise<void> {
        let username = this.userQueryService.getUsername();
        return axios.post(`user/${username}/contentId/${content.id}/save`, content)
            .then((response) => {
                return response.data;
            })
            .catch((response) => {
                throw response.response.data;
            });
    }
}

export const contentHttpService = new CreateContentHttpService(userQueryService);
