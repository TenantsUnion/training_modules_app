import axios from "axios";
import {ContentData, ContentEntity, CreateUserContentCommand} from "@shared/content";
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
            userId: '',
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
        let username = '';

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
        let username = '';

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
        let username = '';
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
