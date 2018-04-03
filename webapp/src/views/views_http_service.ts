import axios from 'axios';
import {ViewSearchParams, ViewSearchQueryParams, LoadViewRequestParams, LoadViewResponse} from "@shared/views";

/**
 * Responsible for fetching data by querying server endpoint with view requests
 *
 * More specific functions for each vuex store type should call this api in order to abstract non state logic
 * out of the store actions
 *
 * @type {{loadViews(params: ViewsRequestParams): Promise<ViewsResponse>; searchViews(params: ViewSearchParams): Promise<any>}}
 */
export const viewsHttpService = {
    async loadViews(params: LoadViewRequestParams): Promise<LoadViewResponse> {
        return (await axios.get('views', {params})).data;
    },

    async searchViews<Id, Row>(params: ViewSearchQueryParams<Id, Row>) {
        return (await axios.get('views/search', {params: params})).data;
    }
};

