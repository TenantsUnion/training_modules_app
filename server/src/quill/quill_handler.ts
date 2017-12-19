import {QuillRepository} from './quill_repository';
import {isQuillEditorData, QuillEditorData} from '../../../shared/quill_editor';
import {quillRepository} from '../config/repository_config';
import {OrderedContentQuestions} from '../../../shared/training_entity';
import {LoggerInstance} from 'winston';
import {getLogger} from '../log';

export class QuillHandler {
    logger: LoggerInstance = getLogger('QuillHandler');
    constructor(private quillRepository: QuillRepository){

    }

    async createTrainingEntityContent(orderedContentQuestions: OrderedContentQuestions): Promise<string[]> {
        let quillContent: QuillEditorData[] = orderedContentQuestions
            .map((el) => isQuillEditorData(el) && el);
        this.logger.log('trace', `Content and questions: ${JSON.stringify(quillContent, null, 2)}`);

        // create quill content
        let quillIds = await this.quillRepository.getNextIds(quillContent.length);
        this.logger.info(`Using quill ids ${JSON.stringify(quillIds, null, 2)}`);
        let insertContentAsync = quillContent.map(async (content, index) => {
            return quillRepository.insertEditorJson(quillIds[index], content.editorJson);
        });

        await Promise.all(insertContentAsync);

        return quillIds;
    }

    loadQuillData(quillId: string): Promise<QuillEditorData> {
        return this.quillRepository.loadEditorJson(quillId);
    }
}

export const quillHandler = new QuillHandler(quillRepository);