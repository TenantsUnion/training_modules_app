import axios from 'axios';
import {QuillEditorData, QuillTransferData} from '@shared/quill_editor';

/**
 * Loads quill data based on an id and last modified date using local storage as a cache.
 */
export class QuillService {
    async loadMultipleQuillData(quillTransferData: QuillTransferData[]): Promise<{ [p: string]: QuillEditorData }> {

        let queryQuillIds = quillTransferData.map(({id}) => id);

        let queryQuillIdsAsync: Promise<QuillEditorData[]> = axios.get(`quill-data/retrieve`, {
            params: {ids: queryQuillIds}
        }).then((response) => response.data);

        let quillData: QuillEditorData[] = await queryQuillIdsAsync;
        return quillData.reduce((acc, el) => {
            acc[el.id] = el;
            return acc;
        }, {});
    }
}

export const quillService = new QuillService();