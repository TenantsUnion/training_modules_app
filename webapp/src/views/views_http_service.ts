import axios from 'axios';
import {ViewsRequestParams, ViewsResponse} from "@shared/views";

export const viewsHttpService = {
    async loadViews (params: ViewsRequestParams): Promise<ViewsResponse> {
        return (await axios.get('views', {
            params: params
        })).data;
    }
};

