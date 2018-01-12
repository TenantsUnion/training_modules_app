import * as _ from 'underscore';
import {QuillHandler} from './quill/quill_handler';
import {QuestionHandler} from './question/question_handler';
import {CreateContentQuestion, ContentQuestionsDelta, ContentQuestionEntity} from '../../../shared/training_entity';
import {isQuillEditorData} from '../../../shared/quill_editor';
import {LoggerInstance} from 'winston';
import {getLogger, LOG_LEVELS} from '../log';
import {isCreateQuestionData} from '../../../shared/questions';
import {updateArrOpsValues} from '../../../shared/delta/diff_key_array';
import {updateArrPlaceholderIds, updateObjPlaceholderIds} from '../../../shared/delta/update_placeholder_ids';

export type ContentQuestionIdsObj = {
    orderedContentQuestionIds: string[];
    orderedContentIds: string[];
    orderedQuestionIds: string[];
}

export class TrainingEntityHandler {
    logger: LoggerInstance = getLogger('TrainingEntityHandler', LOG_LEVELS.debug);

    constructor(private quillHandler: QuillHandler,
                private questionHandler: QuestionHandler) {
    }

    /**
     * Entry point for handling updates to Content and Questions for updating a {@link TrainingEntity}.
     * Quill content and question updates and creation are performed by the handler and a {@link ContentQuestionsDelta}
     * is returned with the placeholder ids (that were sent by the client) substituted with unique ids generated
     * via database sequence with {@link AbstractRepository#getNextId}
     *
     * @param {ContentQuestionsDelta} contentQuestionChanges
     * @returns {Promise<ContentQuestionsDelta>} change object with placeholder ids substituted for ids created via database sequence
     */
    async handleContentQuestionDelta(contentQuestionChanges: ContentQuestionsDelta): Promise<{[index:string]: string}> {
        let {quillChanges, questionChanges, orderedContentIds, orderedQuestionIds, orderedContentQuestionIds}
            = contentQuestionChanges;
        let quillIdMap = await this.quillHandler.handleQuillChanges(quillChanges);
        this.logger.info(`Quill id map:${JSON.stringify(quillIdMap, null, 2)}`);
        let questionIdMap = await this.questionHandler.handleQuestionChanges(updateObjPlaceholderIds(questionChanges, quillIdMap));
        this.logger.info(`questionIdMap id map:${JSON.stringify(questionIdMap, null, 2)}`);

        let updatedContentOps = updateArrOpsValues(orderedContentIds, quillIdMap);
        let updatedQuestionOps = updateArrOpsValues(orderedQuestionIds, questionIdMap);
        let updatedOrderedContentQuestionOps =
            updateArrOpsValues(orderedContentQuestionIds, {...quillIdMap, ...questionIdMap});

        return {
            ...quillIdMap, ...questionIdMap
        };
    }
}

