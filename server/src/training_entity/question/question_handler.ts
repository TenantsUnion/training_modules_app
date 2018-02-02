import {QuestionOptionRepository} from './question_option_repository';
import {QuestionRepository} from './question_repository';
import {
    convertQuestionChangesToEntity, OptionQuillIdsObj, QuestionChanges,
    QuestionChangesObj
} from '@shared/questions';
import {updateObjPlaceholderIds} from '@shared/delta/update_placeholder_ids';
import {applyDeltaDiff} from '@shared/delta/apply_delta';
import {LoggerInstance} from 'winston';
import {getLogger} from '../../log';
import {isCreatedQuestionOptionPlaceholderId, isCreatedQuestionPlaceholderId} from "@shared/ids";

export class QuestionHandler {
    logger:LoggerInstance = getLogger('QuestionHandler', 'info');
    constructor(private questionRepository: QuestionRepository,
                private questionOptionRepository: QuestionOptionRepository) {
    }

    /**
     * Entry point for handling question creation and changes for a {@link ContentQuestionEntity}
     * @param {QuestionChangesObj} questionChanges
     * @returns {Promise<{[p: string]: string}>}
     */
    async handleQuestionChanges(questionChanges: QuestionChangesObj): Promise<{ [p: string]: string }> {
        const placeholderOptionIdMap = await this.createQuestionOptions(questionChanges);
        this.logger.info(`Option id map:${JSON.stringify(placeholderOptionIdMap, null, 2)}`);
        const resolvedOptionIdsQuestionChanges = updateObjPlaceholderIds(questionChanges, placeholderOptionIdMap);
        await this.updateQuestions(resolvedOptionIdsQuestionChanges);
        const placeholderQuestionIdMap = await this.createQuestions(resolvedOptionIdsQuestionChanges);
        return {...placeholderQuestionIdMap, ...placeholderOptionIdMap};
    };

    /**
     * Handles updating already created questions according to the provided questionChanges object.
     * Ignores question changes with placeholder ids
     * @param questionChanges
     * @returns {Promise<void>}
     */
    private async updateQuestions(questionChanges: QuestionChangesObj) {
        // todo handle removing options
        let questionUpdatesAsync = Object.keys(questionChanges)
            .filter((key) => !isCreatedQuestionPlaceholderId(key))
            .map((questionId) =>
                this.updateQuestion(questionId, questionChanges[questionId]));

        await Promise.all(questionUpdatesAsync);
    }

    /**
     * Handles loading and applying a QuestionChange delta object to the specified {@link QuestionEntity}
     * @returns {Promise<void>}
     */
    private async updateQuestion(questionId: string, changes: QuestionChanges){
       let questionEntity = await this.questionRepository.loadQuestionEntity(questionId);
       let updatedQuestionEntity = applyDeltaDiff(questionEntity, changes);
       await this.questionRepository.saveQuestionEntity(updatedQuestionEntity);
    }

    /**
     * Handles creating all the new question options
     * @param {{[p: string]: QuestionChanges}} questionChanges
     * @returns {Promise<{[p: string]: string}>} question option id map to replace placeholder ids with their corresponding options
     */
    private async createQuestionOptions(questionChanges: { [p: string]: QuestionChanges }): Promise<{ [p: string]: string }> {
        let createOptionsObj: { [optionId: string]: OptionQuillIdsObj } = Object.keys(questionChanges)
            .reduce((createOptionsAcc, questionId) => {
                if (!(questionChanges[questionId] && questionChanges[questionId].optionChangesObject)) {
                    // filter out question change objects that do not have option changes
                    return createOptionsAcc;
                }

                const optionChangesObj = questionChanges[questionId].optionChangesObject;
                Object.keys(optionChangesObj)
                    .filter((optionId) => isCreatedQuestionOptionPlaceholderId(optionId))
                    .reduce((optionAcc, placeholderOptionId) => {
                        optionAcc[placeholderOptionId] = optionChangesObj[placeholderOptionId];
                        return optionAcc;
                    }, createOptionsAcc);
                return createOptionsAcc;
            }, {});

        let placeholderIds = Object.keys(createOptionsObj);
        let optionIds = await this.questionOptionRepository.getNextIds(placeholderIds.length);
        let insertOptionsAsync = placeholderIds.map((placeholderId, index) => {
            return this.questionOptionRepository.createQuestionOption({
                id: optionIds[index],
                ...createOptionsObj[placeholderId]
            });
        });
        const optionsPlaceholderIdMap = placeholderIds.reduce((acc, placeholderId, index) => {
            acc[placeholderId] = optionIds[index];
            return acc;
        }, {});
        await Promise.all(insertOptionsAsync);
        return optionsPlaceholderIdMap;
    }

    private async createQuestions(questionsChanges: QuestionChangesObj): Promise<{ [p: string]: string }> {
        let placeholderIds = Object.keys(questionsChanges).filter((id) => isCreatedQuestionPlaceholderId(id));
        if (!placeholderIds.length) {
            return {};
        }

        let questionIds = await this.questionOptionRepository.getNextIds(placeholderIds.length);
        let createQuestionsAsync = placeholderIds.map((placeholderId, index) => {
            let id = questionIds[index];
            let questionDelta = questionsChanges[placeholderId];
            return this.questionRepository.insertQuestion(convertQuestionChangesToEntity(id, questionDelta));
        });

        let questionPlaceholderIdMap = placeholderIds.reduce((acc, placeholder, index) => {
            acc[placeholder] = questionIds[index];
            return acc;
        }, {});

        await Promise.all(createQuestionsAsync);
        return questionPlaceholderIdMap;
    }
}