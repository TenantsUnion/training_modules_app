import Vue from 'vue';
import {hasChanges, TrainingEntityDelta} from '@shared/training';
import {DeltaArrOp} from '@shared/delta/diff_key_array';
import {DeltaStatic} from 'quill';
import {QuestionChanges} from '@shared/questions';
import {RootGetters, RootState, TypedAction, VuexModuleConfig} from '@store/store_types';
import {ActionTree, GetterTree} from 'vuex';

export interface EditTrainingState {
    unsavedEdits: TrainingEntityDelta
    editing: {
        quillChanges: { [index: string]: string },
        [index: string]: string | { [index: string]: string }
    },
    saving: boolean;
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
    SET_BASIC_FIELD_EDITING = 'SET_BASIC_FIELD_EDITING'
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
};

export const editTrainingMutations: EditTrainingMutations = {
    BASIC_EDIT({unsavedEdits}: EditTrainingState, {val, prop}: { prop: string, val: string | number }) {
        Vue.set(unsavedEdits, prop, val);
    },
    CLEAR_BASIC_EDIT({unsavedEdits}: EditTrainingState, prop: string) {
        Vue.delete(unsavedEdits, prop);
    },
    RESET_ALL(state: EditTrainingState) {
        Vue.set(state, 'unsavedEdits', editTrainingStoreConfig.initState().unsavedEdits);
    },
    ARR_OP_EDIT({unsavedEdits}: EditTrainingState, {prop, op}: { prop: string, op: DeltaArrOp }) {
        let editsArr = <DeltaArrOp[]> unsavedEdits[prop];
        Vue.set(unsavedEdits, prop, editsArr ? [...editsArr, op] : [op]);
    },
    APPLY_QUILL_OP({unsavedEdits: {quillChanges}}: EditTrainingState, {id, op}: { id: string, op: DeltaStatic }) {
        let delta: DeltaStatic = quillChanges[id] ? (<DeltaStatic>quillChanges[id]).compose(op) : op;
        Vue.set(quillChanges, id, delta);
    },
    SET_QUESTION_CHANGES({unsavedEdits: {questionChanges}}, {id, changes}: { id: string, changes: QuestionChanges }) {
        Vue.set(questionChanges, id, changes);
    },
    CONTENT_IDS_OP({unsavedEdits}: EditTrainingState, op) {
        Vue.set(unsavedEdits, 'orderedContentIds', [...unsavedEdits.orderedContentIds, op]);
    },
    QUESTION_IDS_OP({unsavedEdits}: EditTrainingState, op) {
        Vue.set(unsavedEdits, 'orderedQuestionIds', [...unsavedEdits.orderedQuestionIds, op]);
    },
    CONTENT_QUESTION_IDS_OP({unsavedEdits}: EditTrainingState, op) {
        Vue.set(unsavedEdits, 'orderedContentQuestionIds', [...unsavedEdits.orderedContentQuestionIds, op]);
    },
    SET_BASIC_FIELD_EDITING({editing}: EditTrainingState, {fieldName, editMode}) {
        editMode ? Vue.set(editing, fieldName, fieldName) : Vue.delete(editing, fieldName)
    }
};


export type EditTrainingAction<P, V> = TypedAction<EditTrainingState, P, V>;

export enum EDIT_TRAINING_ACTIONS {
    EDIT_BASIC_FIELD = 'EDIT_BASIC_FIELD'
}

export interface EditTrainingActions extends ActionTree<EditTrainingState, RootState> {
    EDIT_BASIC_FIELD: EditTrainingAction<{ fieldName: string, val: any }, void>;
}

export const editTrainingActions: EditTrainingActions = {
    EDIT_BASIC_FIELD({rootGetters, commit}, {fieldName, val}) {
        let storedVal = (<RootGetters> rootGetters).currentTraining[fieldName];
        if (storedVal !== val) {
            // set edit training value only if edit is different
            commit(EDIT_TRAINING_MUTATIONS.BASIC_EDIT, {prop: fieldName, val});
        } else {
            // delete edit field since val has been changed back or reset
            commit(EDIT_TRAINING_MUTATIONS.CLEAR_BASIC_EDIT, fieldName);
        }
    }
};

export type EditTrainingStoreConfig = VuexModuleConfig<EditTrainingState, {}, {}, EditTrainingMutations>;
export const editTrainingStoreConfig: EditTrainingStoreConfig = {
    initState() {
        return {
            saving: false,
            editing: {
                quillChanges: {},
                questionChanges: {},
                orderedContentIds: {},
                orderedQuestionIds: {},
                orderedContentQuestionIds: {}
            },
            unsavedEdits: {
                quillChanges: {},
                questionChanges: {},
                orderedContentIds: [],
                orderedQuestionIds: [],
                orderedContentQuestionIds: []
            }
        };
    },
    module() {
        return {
            state: this.initState(),
            actions: editTrainingActions,
            getters: editTrainingGetters,
            mutations: editTrainingMutations
        };
    }
};
