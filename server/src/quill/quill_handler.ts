import {QuillRepository} from './quill_repository';
import {QuillEditorData} from '../../../shared/quill';
import {quillRepository} from '../config/repository.config';

export class QuillHandler {
    constructor(private quillRepository: QuillRepository){

    }

    loadQuillData(quillId: string): Promise<QuillEditorData> {
        return this.quillRepository.loadEditorJson(quillId);
    }
}

export const quillHandler = new QuillHandler(quillRepository);