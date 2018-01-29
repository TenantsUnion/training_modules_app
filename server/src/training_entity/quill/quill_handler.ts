import * as _ from 'underscore';
import {QuillRepository} from './quill_repository';
import {isCreatedQuillPlaceholderId, QuillEditorData} from '@shared/quill_editor';
import {quillRepository} from '../../config/repository_config';
import {LoggerInstance} from 'winston';
import {getLogger} from '../../log';
import {Delta} from '@shared/normalize_imports';
import {QuillChangesObj} from '@shared/training_entity';


export class QuillHandler {
    logger: LoggerInstance = getLogger('QuillHandler', 'info');

    constructor (private quillRepository: QuillRepository) {
    }

    async handleQuillChanges (changeQuillContent: QuillChangesObj): Promise<{ [index: string]: string }> {
        await this.updateQuillContent(changeQuillContent);
        return await this.insertQuillContentFromUpdate(changeQuillContent);
    }

    /**
     * For each quill id of the provided changes that is not a placeholder id(needs to be inserted) the corresponding
     * Quill.DeltaStatic property is composed with the current Quill.DeltaStatic value of the corresponding id
     * @param {QuillContentObj} quillChanges
     * @returns {Promise<void>}
     */
    async updateQuillContent (quillChanges: QuillChangesObj) {
        let ids = Object.keys(quillChanges);
        let updateChanges = ids.filter((id) => !isCreatedQuillPlaceholderId(id));
        if (!updateChanges.length) {
            return;
        }

        let quillData = await this.quillRepository.loadMultipleQuillData(updateChanges);
        let asyncUpdate = quillData
            .map((content: QuillEditorData) => {
                let {version} = content;
                return _.extend({}, content, {
                    version: version + 1,
                    editorJson: new Delta(content.editorJson.ops).compose(quillChanges[content.id]),
                    lastModifiedAt: new Date()
                });
            })
            .map((updated) => this.quillRepository.updateEditorJson(updated));

        await asyncUpdate;
    }

    async insertQuillContentFromUpdate (quillChanges: QuillChangesObj): Promise<{ [p: string]: string }> {
        let insertIds = Object.keys(quillChanges).filter((id) => isCreatedQuillPlaceholderId(id));
        if (!insertIds.length) {
            return {};
        }

        let quillIds = await this.quillRepository.getNextIds(insertIds.length);
        let insertAsync = insertIds.map((placeholderId, index) => {
            return this.quillRepository.insertEditorJson(quillIds[index], quillChanges[placeholderId]);
        });
        let placeholderIdMap = insertIds.reduce((acc, placeholderId, index) => {
            acc[placeholderId] = quillIds[index];
            return acc;
        }, {});

        await Promise.all(insertAsync);
        return placeholderIdMap;
    }

    async insertQuillContent (quillContent: Quill.DeltaStatic): Promise<string> {
        // create quill content
        let quillId = await this.quillRepository.getNextId();
        await quillRepository.insertEditorJson(quillId, quillContent);
        return quillId;
    }

    loadQuillData (quillId: string): Promise<QuillEditorData> {
        return this.quillRepository.loadQuillData(quillId);
    }
}

