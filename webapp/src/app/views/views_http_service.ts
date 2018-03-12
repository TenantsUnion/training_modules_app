import {ViewsRequestParams, ViewsResponse} from "@shared/views";
import axios from 'axios';

export const viewsHttpService = {
    async loadViews (params: ViewsRequestParams): Promise<ViewsResponse> {
        return (await axios.get('views', {
            params: params
        })).data;
    }
};

