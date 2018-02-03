export enum IdPrefixes {
    QUILL_DATA = 'QD',
    CREATED_QUILL = 'QD-CREATED-QUILL',
    QUESTION_OPTION = 'QO',
    CREATED_QUESTION_OPTION = 'QO-CREATED-QUESTION-OPTION',
    QUESTION = 'QU',
    CREATED_QUESTION = 'QU-CREATED-QUESTION'
}

/* Quill Placeholder Id */
let contentPlaceholderIdCounter = 0;
export const createdQuillPlaceholderId = () => {
    return `${IdPrefixes.CREATED_QUILL}-${contentPlaceholderIdCounter++}`;
};

export const isCreatedQuillPlaceholderId = (id: string) => {
    return id.indexOf(IdPrefixes.CREATED_QUILL) === 0;
};

export const isQuillId = (id: string) => {
    return id.indexOf(IdPrefixes.QUILL_DATA)
}

/* Question Placeholder Id */
let questionPlaceholderIdCounter = 0;

export const createdQuestionPlaceholderId = () => {
    return `${IdPrefixes.CREATED_QUESTION}-${questionPlaceholderIdCounter++}`;
};

export const isCreatedQuestionPlaceholderId = (id: string) => {
    return id.indexOf(IdPrefixes.CREATED_QUESTION) === 0;
};

export const isQuestionId = (id: string) => {
    return id.indexOf(IdPrefixes.QUESTION) === 0;
};

/* Question Option Placeholder Id */
let questionOptionPlaceholderIdCounter = 0;

export const createdQuestionOptionPlaceholderId = () => {
    return `${IdPrefixes.CREATED_QUESTION_OPTION}-${questionOptionPlaceholderIdCounter++}`;
};

export const isCreatedQuestionOptionPlaceholderId = (id: string) => {
    return id.indexOf(IdPrefixes.CREATED_QUESTION_OPTION) === 0;
};

export const isQuestionOptionId = (id: string) => {
    return id.indexOf(IdPrefixes.QUESTION_OPTION) === 0;
};
