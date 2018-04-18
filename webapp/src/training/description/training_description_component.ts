import Vue from 'vue';
import Component from 'vue-class-component';
import TrainingElement from '@training/training_element/training_element_component.vue';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';
import {CourseMode} from '@course/course_store';

@Component({
    components: {
        'training-element': TrainingElement
    },
    computed: mapState({
        training: (rootState, {currentTraining}: RootGetters) => currentTraining,
        isAdmin: (rootState, {currentCourseMode}: RootGetters) => currentCourseMode === CourseMode.ADMIN
    })
})
export class TrainingDescriptionComponent extends Vue {
    formstate = {};
    editDescription: string = '';
}

export default TrainingDescriptionComponent
;