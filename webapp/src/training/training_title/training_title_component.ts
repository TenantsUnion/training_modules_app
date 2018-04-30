import Component, {mixins} from 'vue-class-component';
import {EDIT_TRAINING_MUTATIONS} from '@training/edit_training_store/edit_training_state';
import {TrainingFieldComponent} from '@training/training_element/training_element_component';
import {TrainingElementMixin} from '@training/training_element_mixin';

@Component
export class TrainingTitleComponent extends mixins(TrainingElementMixin) implements TrainingFieldComponent {
    formstate = {};

    get title (){
        return this.$state.editTraining.unsavedEdits['title'] || this.$getters.currentTraining.title
    }

    set title(title: string) {
        this.$store.commit(EDIT_TRAINING_MUTATIONS.BASIC_EDIT, {prop: 'title', val: title})
    }

    cancelCallback() {
        this.$store.commit(EDIT_TRAINING_MUTATIONS.CLEAR_BASIC_EDIT, 'title');
    }
}

export default TrainingTitleComponent;