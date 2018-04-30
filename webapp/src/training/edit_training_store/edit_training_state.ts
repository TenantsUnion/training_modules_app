import Vue from 'vue';
import {TrainingEntityDelta} from '@shared/training';
import {DeltaArrOp} from '@shared/delta/diff_key_array';
import {DeltaStatic} from 'quill';
import {QuestionChanges} from '@shared/questions';
import {VuexModuleConfig} from '@store/store_types';

export interface EditTrainingState {
    unsavedEdits: TrainingEntityDelta
    saving: boolean;
}

export enum EDIT_TRAINING_MUTATIONS {
    BASIC_EDIT = 'BASIC_EDIT',
    CLEAR_BASIC_EDIT = 'CLEAR_BASIC_EDIT',
    ARR_OP_EDIT = 'ARR_OP_EDIT',
    CONTENT_IDS_OP = 'CONTENT_IDS_OP',
    QUESTION_IDS_OP = 'QUESTION_IDS_OP',
    CONTENT_QUESTION_IDS_OP = 'CONTENT_QUESTION_IDS_OP',
    APPLY_QUILL_OP = 'APPLY_QUILL_OP',
    SET_QUESTION_CHANGES = 'SET_QUESTION_CHANGES'
}

export type EditTrainingMutation<P> = (state: EditTrainingState, payload: P) => any;
export type EditTrainingMutations = {[index in EDIT_TRAINING_MUTATIONS]: EditTrainingMutation<any>} & {
    BASIC_EDIT: EditTrainingMutation<{ prop: string, val: string | number }>,
    CLEAR_BASIC_EDIT: EditTrainingMutation<string>,
    ARR_OP_EDIT: EditTrainingMutation<{ prop: string, op: DeltaArrOp }>,
    CONTENT_IDS_OP: EditTrainingMutation<DeltaArrOp<string>>,
    QUESTION_IDS_OP: EditTrainingMutation<DeltaArrOp<string>>,
    CONTENT_QUESTION_IDS_OP: EditTrainingMutation<DeltaArrOp<string>>,
    APPLY_QUILL_OP: EditTrainingMutation<{ id: string, op: DeltaStatic }>,
    SET_QUESTION_CHANGES: EditTrainingMutation<{ id: string, changes: QuestionChanges }>
};

export const editTrainingMutations: EditTrainingMutations = {
    BASIC_EDIT({unsavedEdits}: EditTrainingState, {val, prop}: { prop: string, val: string | number }) {
        Vue.set(unsavedEdits, prop, val);
    },
    CLEAR_BASIC_EDIT({unsavedEdits}: EditTrainingState, prop: string) {
        Vue.delete(unsavedEdits, prop);
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
    }
};

export type EditTrainingStoreConfig = VuexModuleConfig<EditTrainingState, {}, {}, EditTrainingMutations>;
export const editTrainingStoreConfig: EditTrainingStoreConfig = {
    initState() {
        return {
            saving: false,
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
            actions: {},
            getters: {},
            mutations: editTrainingMutations
        };
    }
};
