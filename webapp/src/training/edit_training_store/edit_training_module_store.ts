import {VuexModuleConfig} from '@store/store_types';
import {
    editTrainingGetters, EditTrainingGetters, editTrainingInitState, editTrainingMutations,
    EditTrainingMutations, EditTrainingState
} from '@training/edit_training_store/edit_training_state_store';
import {editTrainingActions, EditTrainingActions} from '@training/edit_training_store/edit_training_actions_store';

export type EditTrainingStoreConfig =
    VuexModuleConfig<EditTrainingState, EditTrainingGetters, EditTrainingActions, EditTrainingMutations>;

export const editTrainingStoreConfig: EditTrainingStoreConfig = {
    initState() {
        return editTrainingInitState();
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
