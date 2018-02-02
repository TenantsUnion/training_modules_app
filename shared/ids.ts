/* Quill Placeholder Id */
let contentPlaceholderIdCounter = 0;
export const CREATED_QUILL_PREFIX = 'QD-CREATED-QUILL';

export const createdQuillPlaceholderId = () => {
    return `${CREATED_QUILL_PREFIX}-${contentPlaceholderIdCounter++}`;
};

export const isCreatedQuillPlaceholderId = (id: string) => {
    return id.indexOf(CREATED_QUILL_PREFIX) === 0;
};

/* Question Placeholder Id */
let questionPlaceholderIdCounter = 0;
export const CREATED_QUESTION_PREFIX = 'QU-CREATED-QUESTION';

export const createdQuestionPlaceholderId = () => {
    return `${CREATED_QUESTION_PREFIX}-${questionPlaceholderIdCounter++}`;
};

export const isCreatedQuestionPlaceholderId = (id: string) => {
    return id.indexOf(CREATED_QUESTION_PREFIX) === 0;
};

/* Question Option Placeholder Id */
let questionOptionPlaceholderIdCounter = 0;
export const CREATED_QUESTION_OPTION_PREFIX = 'QO-CREATED-QUESTION-OPTION';

export const createdQuestionOptionPlaceholderId = () => {
    return `${CREATED_QUESTION_OPTION_PREFIX}-${questionOptionPlaceholderIdCounter++}`;
};

export const isCreatedQuestionOptionPlaceholderId = (id: string) => {
    return id.indexOf(CREATED_QUESTION_OPTION_PREFIX) === 0;
};
