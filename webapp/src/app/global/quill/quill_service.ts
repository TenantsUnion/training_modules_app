import {Moment} from 'moment';
import * as moment from 'moment';
import * as _ from 'underscore';
import axios from 'axios';
import {QuillEditorData} from 'quill_editor';
import {DeltaStatic} from 'quill';

let Delta: DeltaStatic = Quill.import('delta');

/**
 * Loads quill data based on an id and last modified date using local storage as a cache.
 */
export class QuillService {
    quillQueries: { [index: string]: Promise<QuillEditorData> } = {};
    quillDataCache: { [index: string]: Promise<QuillEditorData> } = {};

    async loadQuillData(quillId: string, lastModified: Moment): Promise<QuillEditorData> {
        if (!quillId) {
            console.error('Tried to load quill data with no quill id');
            return Promise.resolve(null);
        }

        if (this.quillQueries[quillId]) {
            return await this.quillQueries[quillId];
        }

        let rawQuillData = JSON.parse(localStorage.getItem(quillId));
        if (rawQuillData && !lastModified.isAfter(moment(rawQuillData.lastModifiedAt))) {
            return Promise.resolve(_.extend({}, rawQuillData, {lastModified: moment(rawQuillData.lastModifiedAt)}));
        }

        let quillDataQuery = axios.get(`quill-data/${quillId}`).then((response) => {
            let quillData = _.extend({}, response.data, {
                lastModified: moment(response.data.lastModifiedAt)
            });
            delete this.quillQueries[quillData.id];
            this.quillDataCache[quillData.id] = quillData;
            return quillData;
        });

        this.quillQueries[quillId] = quillDataQuery;

        return await quillDataQuery;
    }

    async getQuillId(): Promise<string> {
        let idRequest = await axios.get('/quill-id');
        return idRequest.data;
    }

    async createQuillContent(): Promise<QuillEditorData> {
        let id = await this.getQuillId();
        return {
            editorJson: new Delta(),
            lastModifiedAt: new Date(),
            id
        };
    }
}

export const quillService = new QuillService();