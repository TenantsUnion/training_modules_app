import Vue from 'vue';
import {hasChanges, TrainingEntityDelta} from '@shared/training';
import {DeltaArrOp} from '@shared/delta/diff_key_array';
import {DeltaStatic} from 'quill';
import {QuestionChanges} from '@shared/questions';
import {RootGetters, RootState} from '@store/store_types';
import {GetterTree} from 'vuex';

export interface EditTrainingState {
    unsavedEdits: TrainingEntityDelta
    editing: {
        quillChanges: { [index: string]: string },
        [index: string]: string | { [index: string]: string }
    },
    creatingCourse: false,
    creatingModule: false,
    creatingSection: false,
    saving: { [id: string]: boolean },
}

export interface EditTrainingAccessors {
    hasEdits: boolean
    fieldHasEdits: (fieldName: keyof TrainingEntityDelta) => boolean;
    isEditingField: (fieldName: keyof TrainingEntityDelta) => boolean;
}

export type EditTrainingGetter<V> = (state: EditTrainingState, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => V
export type EditTrainingGetters = GetterTree<EditTrainingState, RootState> & {
    hasEdits: EditTrainingGetter<boolean>;
    fieldHasEdits: EditTrainingGetter<(fieldName: keyof TrainingEntityDelta) => boolean>;
    isEditingField: EditTrainingGetter<(fieldName: keyof TrainingEntityDelta) => boolean>;
};

export const editTrainingGetters: EditTrainingGetters = {
    hasEdits({unsavedEdits}: EditTrainingState) {
        return hasChanges(unsavedEdits);
    },
    fieldHasEdits({unsavedEdits}: EditTrainingState) {
        return (fieldName: keyof TrainingEntityDelta) => {
            let val = unsavedEdits[fieldName];
            if (Array.isArray(val)) {
                return !!val.length
            } else if (typeof val === 'object') {
                return !!Object.keys(val).length;
            } else {
                return val !== undefined;
            }
        };
    },
    isEditingField({editing}) {
        return (fieldName: keyof TrainingEntityDelta) => {
            return !!editing[fieldName];
        }
    }
};

export enum EDIT_TRAINING_MUTATIONS {
    BASIC_EDIT = 'BASIC_EDIT',
    CLEAR_BASIC_EDIT = 'CLEAR_BASIC_EDIT',
    RESET_ALL = 'RESET_ALL',
    ARR_OP_EDIT = 'ARR_OP_EDIT',
    CONTENT_IDS_OP = 'CONTENT_IDS_OP',
    QUESTION_IDS_OP = 'QUESTION_IDS_OP',
    CONTENT_QUESTION_IDS_OP = 'CONTENT_QUESTION_IDS_OP',
    APPLY_QUILL_OP = 'APPLY_QUILL_OP',
    SET_QUESTION_CHANGES = 'SET_QUESTION_CHANGES',
    SET_BASIC_FIELD_EDITING = 'SET_BASIC_FIELD_EDITING',

    SET_CREATING_COURSE = 'SET_CREATING_COURSE',
    SET_CREATING_MODULE = 'SET_CREATING_MODULE',
    SET_CREATING_SECTION = 'SET_CREATING_SECTION',
    ADD_SAVING = 'ADD_SAVING',
    REMOVE_SAVING = 'REMOVE_SAVING'
}

export type EditTrainingMutation<P> = (state: EditTrainingState, payload: P) => any;
export type EditTrainingMutations = {[index in EDIT_TRAINING_MUTATIONS]: EditTrainingMutation<any>} & {
    BASIC_EDIT: EditTrainingMutation<{ prop: string, val: string | number | boolean }>,
    CLEAR_BASIC_EDIT: EditTrainingMutation<string>,
    RESET_ALL: EditTrainingMutation<void>,
    ARR_OP_EDIT: EditTrainingMutation<{ prop: string, op: DeltaArrOp }>,
    CONTENT_IDS_OP: EditTrainingMutation<DeltaArrOp<string>>,
    QUESTION_IDS_OP: EditTrainingMutation<DeltaArrOp<string>>,
    CONTENT_QUESTION_IDS_OP: EditTrainingMutation<DeltaArrOp<string>>,
    APPLY_QUILL_OP: EditTrainingMutation<{ id: string, op: DeltaStatic }>,
    SET_QUESTION_CHANGES: EditTrainingMutation<{ id: string, changes: QuestionChanges }>
    SET_BASIC_FIELD_EDITING: EditTrainingMutation<{ fieldName: string, editMode: boolean }>

    SET_CREATING_COURSE: EditTrainingMutation<boolean>,
    SET_CREATING_MODULE: EditTrainingMutation<boolean>,
    SET_CREATING_SECTION: EditTrainingMutation<boolean>,
    ADD_SAVING: EditTrainingMutation<string>
    REMOVE_SAVING: EditTrainingMutation<string>
};

export const editTrainingInitState = (): EditTrainingState => {
    return {
        creatingCourse: false,
        creatingModule: false,
        creatingSection: false,
        saving: {},
        editing: {
            quillChanges: {},
            questionChanges: {},
            orderedContentIds: {},
            orderedQuestionIds: {},
            orderedContentQuestionIds: {}
        },
        unsavedEdits: {
            contentQuestions: {
                quillChanges: {},
                questionChanges: {},
                orderedContentIds: [],
                orderedQuestionIds: [],
                orderedContentQuestionIds: []
            }
        }
    }
};

export const editTrainingMutations: EditTrainingMutations = {
    BASIC_EDIT({unsavedEdits}: EditTrainingState, {val, prop}: { prop: string, val: string | number }) {
        Vue.set(unsavedEdits, prop, val);
    },
    CLEAR_BASIC_EDIT({unsavedEdits}: EditTrainingState, prop: string) {
        Vue.delete(unsavedEdits, prop);
    },
    RESET_ALL(state: EditTrainingState) {
        Vue.set(state, 'unsavedEdits', editTrainingInitState().unsavedEdits);
    },
    ARR_OP_EDIT({unsavedEdits}: EditTrainingState, {prop, op}: { prop: string, op: DeltaArrOp }) {
        let editsArr = <DeltaArrOp[]> unsavedEdits[prop];
        Vue.set(unsavedEdits, prop, editsArr ? [...editsArr, op] : [op]);
    },
    APPLY_QUILL_OP({unsavedEdits: {contentQuestions: {quillChanges}}}: EditTrainingState, {id, op}: { id: string, op: DeltaStatic }) {
        let delta: DeltaStatic = quillChanges[id] ? (<DeltaStatic>quillChanges[id]).compose(op) : op;
        Vue.set(quillChanges, id, delta);
    },
    SET_QUESTION_CHANGES({unsavedEdits: {contentQuestions: {questionChanges}}}, {id, changes}: { id: string, changes: QuestionChanges }) {
        Vue.set(questionChanges, id, changes);
    },
    CONTENT_IDS_OP({unsavedEdits: {contentQuestions}}: EditTrainingState, op) {
        Vue.set(contentQuestions, 'orderedContentIds', [...contentQuestions.orderedContentIds, op]);
    },
    QUESTION_IDS_OP({unsavedEdits: {contentQuestions}}: EditTrainingState, op) {
        Vue.set(contentQuestions, 'orderedQuestionIds', [...contentQuestions.orderedQuestionIds, op]);
    },
    CONTENT_QUESTION_IDS_OP({unsavedEdits: {contentQuestions}}: EditTrainingState, op) {
        Vue.set(contentQuestions, 'orderedContentQuestionIds', [...contentQuestions.orderedContentQuestionIds, op]);
    },
    SET_BASIC_FIELD_EDITING({editing}: EditTrainingState, {fieldName, editMode}) {
        editMode ? Vue.set(editing, fieldName, fieldName) : Vue.delete(editing, fieldName)
    },
    SET_CREATING_COURSE({creatingCourse}, creating) {
        creatingCourse = creating;
    },
    SET_CREATING_MODULE({creatingModule}, creating) {
        creatingModule = creating;
    },
    SET_CREATING_SECTION({creatingSection}, creating) {
        creatingSection = creating;
    },
    ADD_SAVING({saving}, id) {
        Vue.set(saving, id, true);
    },
    REMOVE_SAVING({saving}, id) {
        Vue.delete(saving, id);
    }
};

