import {QuestionData, QuestionOptionData} from "@shared/questions";
import {QuillEditorData} from "@shared/quill_editor";

export interface QuestionViewDbData extends QuestionData {
    options: QuestionOptionDbData[],
    questionQuill: QuillEditorData,
    questionQuillId: string,
    optionIds: string[]
}

export interface QuestionOptionDbData extends QuestionOptionData {
    option: QuillEditorData,
    explanation: QuillEditorData,
    optionQuillId: string;
    explanationQuillId: string;
}