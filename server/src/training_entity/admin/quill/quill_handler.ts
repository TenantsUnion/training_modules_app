import * as _ from 'underscore';
import {QuillRepository} from './quill_repository';
import {QuillEditorData} from '../../../../../shared/quill_editor';
import {quillRepository} from '../../../config/repository_config';
import {LoggerInstance} from 'winston';
import {getLogger} from '../../../log';
import {Delta} from '../../../../../shared/normalize_imports';
import {QuillChangesObj} from '../../../../../shared/training_entity';
import {isCreatedQuillPlaceholderId} from "../../../../../shared/ids";


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
                    editorJson: new Delta(content.editorJson.ops).compose(new Delta(quillChanges[content.id].ops)),
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

        let quillIds = await Promise.all(insertIds.map((placeholderId) => {
                return this.quillRepository.insertEditorJson(new Delta(quillChanges[placeholderId].ops));
            }));
        let placeholderIdMap = insertIds.reduce((acc, placeholderId, index) => {
            acc[placeholderId] = quillIds[index];
            return acc;
        }, {});

        return placeholderIdMap;
    }

    loadQuillData (quillId: string): Promise<QuillEditorData> {
        return this.quillRepository.loadQuillData(quillId);
    }
}

