import Vue from 'vue';
import Component from 'vue-class-component';
import TrainingElementComponent from '@training/training_element/training_element_component.vue';
import {EDIT_TRAINING_MUTATIONS} from '@training/edit_training_store/edit_training_state_store';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';
import {CourseMode} from '@course/course_store';
import {EDIT_TRAINING_ACTIONS} from '@training/edit_training_store/edit_training_actions_store';

/**
 * Helper methods for subclasses to get and edit training fields based on passing in the field name
 *
 * Abstract class pattern that lets subclasses override specific hooks won't work here since vue-class-component
 * doesn't support abstract class support since it is just provided syntactic sugar for Vue.extend
 */
@Component({
    components: {
        'training-element': TrainingElementComponent
    },
    computed: mapState({
        isAdmin: (rootState, {currentCourseMode}: RootGetters) => currentCourseMode === CourseMode.ADMIN
    })
})
export class TrainingElementMixin extends Vue {
    formstate = {};

    getCurrentFieldValue(fieldName: string) {
        const unsavedEdit = this.$state.editTraining.unsavedEdits[fieldName];
        return unsavedEdit !== undefined ? unsavedEdit : this.$getters.currentTraining[fieldName];
    }

    setFieldEdit(fieldName: string, val: any) {
        this.$store.dispatch(EDIT_TRAINING_ACTIONS.EDIT_BASIC_FIELD, {fieldName, val})
    }

    cancelEdit(fieldName: string) {
        this.$store.commit(EDIT_TRAINING_MUTATIONS.CLEAR_BASIC_EDIT, fieldName);
    }
}