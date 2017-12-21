import * as _ from 'underscore';
import {QuillRepository} from './quill_repository';
import {isCreatedPlaceholderId, isQuillEditorData, QuillEditorData} from '../../../shared/quill_editor';
import {quillRepository} from '../config/repository_config';
import {OrderedContentQuestions} from '../../../shared/training_entity';
import {LoggerInstance} from 'winston';
import {getLogger} from '../log';
import {QuillContentObj} from '../../../shared/delta/delta';
import Delta from 'quill-delta';


export class QuillHandler {
    logger: LoggerInstance = getLogger('QuillHandler');

    constructor(private quillRepository: QuillRepository) {
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

    async handleQuillChanges(changeQuillContent: QuillContentObj): Promise<{[index: string]: string}> {
        await this.updateQuillContent(changeQuillContent);
        let insertQuillIds = await this.insertQuillContentFromUpdate(changeQuillContent);
        let quillIdMap = insertQuillIds.reduce((acc, quillIdObj) => {
            acc[quillIdObj.placeholderId] = quillIdObj.quillId;
            return acc;
        }, {});
        return quillIdMap;
    }

    /**
     * For each quill id of the provided changes that is not a placeholder id(needs to be inserted) the corresponding
     * Quill.DeltaStatic property is composed with the current Quill.DeltaStatic value of the corresponding id
     * @param {QuillContentObj} quillChanges
     * @returns {Promise<void>}
     */
    async updateQuillContent(quillChanges: QuillContentObj) {
        let ids = Object.keys(quillChanges);
        let updateChanges = ids.filter((id) => !isCreatedPlaceholderId(id));
        if (!updateChanges.length) {
            return;
        }

        let quillData = await this.quillRepository.loadQuillData(updateChanges);
        let asyncUpdate = quillData
            .map((content: QuillEditorData) => {
                return _.extend({}, content, {
                    version: content.version + 1,
                    editorJson: new Delta(content.editorJson).compose(quillChanges[content.id]),
                    lastModifiedAt: new Date()
                });
            })
            .map((updated) => this.quillRepository.updateEditorJson(updated));

        await asyncUpdate;
    }

    async insertQuillContentFromUpdate(quillChanges: QuillContentObj): Promise<{ quillId: string, placeholderId: string }[]> {
        let ids = Object.keys(quillChanges);
        let insertIds = ids.filter((id) => isCreatedPlaceholderId(id));
        if (!insertIds.length) {
            return [];
        }

        let quillIds = await this.quillRepository.getNextIds(insertIds.length);
        let insertContent = insertIds.map((placeholderId, index) => {
            let quillId = quillIds[index];
            return {
                quillId, placeholderId,
                insert: quillRepository.insertEditorJson(quillId, quillChanges[placeholderId]),
            };
        });

        let insertAsync = insertContent.map((content) => content.insert);
        await Promise.all(insertAsync);
        return insertContent;
    }

    async insertQuillContent(quillContent: Quill.DeltaStatic[]): Promise<string[]> {
        // create quill content
        let quillIds = await this.quillRepository.getNextIds(quillContent.length);
        this.logger.info(`Using quill ids ${JSON.stringify(quillIds, null, 2)}`);
        let insertContentAsync = quillContent.map(async (content, index) => {
            return quillRepository.insertEditorJson(quillIds[index], content);
        });

        await Promise.all(insertContentAsync);
        return quillIds;
    }

    loadQuillData(quillId: string): Promise<QuillEditorData> {
        return this.quillRepository.loadEditorJson(quillId);
    }
}

export const quillHandler = new QuillHandler(quillRepository);