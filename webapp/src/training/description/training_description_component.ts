import Vue from 'vue';
import Component from 'vue-class-component';
import TrainingElement from '@training/training_element/training_element_component.vue';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';
import {CourseMode} from '@course/course_store';
import {TrainingFieldComponent} from '@training/training_element/training_element_component';
import {EDIT_TRAINING_MUTATIONS} from '@training/edit_training_store/edit_training_state';
import {TrainingView} from '@shared/training';

@Component({
    components: {
        'training-element': TrainingElement
    },
    computed: mapState({
        training: (rootState, {currentTraining}: RootGetters) => currentTraining,
        isAdmin: (rootState, {currentCourseMode}: RootGetters) => currentCourseMode === CourseMode.ADMIN
    })
})
export class TrainingDescriptionComponent extends Vue implements TrainingFieldComponent {
    training!: TrainingView;
    formstate = {};

    set editDescription(description: string) {
        this.$store.commit(EDIT_TRAINING_MUTATIONS.BASIC_EDIT, {prop: 'description', val: description});
    }

    get editDescription() {
        return this.training.description;
    }

    cancelCallback() {
        this.$store.commit(EDIT_TRAINING_MUTATIONS.CLEAR_BASIC_EDIT, 'description')
    }
}

export default TrainingDescriptionComponent;