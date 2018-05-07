import Component, {mixins} from "vue-class-component";
import {IconComponentMixin} from '@components/icons/icon_component_mixin';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';
import {EDIT_TRAINING_MUTATIONS} from '@training/edit_training_store/edit_training_state';

@Component({
    data: function () {
        return {};
    },
    computed: mapState({
        hasEdits: (state, {hasEdits}: RootGetters) => hasEdits
    })
})
export class EditTrainingActionsComponent extends mixins(IconComponentMixin) {

    save() {
        console.log('saved!');
    }

    resetAll() {
        this.$store.commit(EDIT_TRAINING_MUTATIONS.RESET_ALL);
    }
}

export default EditTrainingActionsComponent;
