import {QuillEditorData} from '../../../../shared/quill';
import {Moment} from 'moment';
import * as moment from 'moment';
import * as _ from 'underscore';
import axios from 'axios';

/**
 * Loads quill data based on an id and last modified date using local storage as a cache.
 */
export class QuillService {
    quillDataCache:{[index:string]: Promise<QuillEditorData>} = {};

    async loadQuillData(quillId: string, lastModified: Moment): Promise<QuillEditorData> {
        if(!quillId) {
            console.error('Tried to load quill data with no quill id');
            return Promise.resolve(null);
        }

        if(this.quillDataCache[quillId]) {
            return this.quillDataCache[quillId];
        }

        let rawQuillData = JSON.parse(localStorage.getItem(quillId));
        if(rawQuillData && !lastModified.isAfter(moment(rawQuillData.lastModified))) {
            return Promise.resolve(_.extend({}, rawQuillData, {lastModified: moment(rawQuillData.lastModified)}));
        }

        // todo keep track of what quill data queries have been sent to the server
        // duplicate requests happen from subscribing to current module and notifying course update
        // both try to get full quill data

        let quillDataQuery = axios.get(`quill-data/${quillId}`).then((response)=>{
            return _.extend({}, response.data, {
               lastModified: moment(response.data.lastModified)
            });
        });

        this.quillDataCache[quillId] = quillDataQuery;

        return quillDataQuery;
    }
}

function isPromise(x: any): x is Promise<void> {
    return typeof x === 'function';
}


export const quillService = new QuillService();