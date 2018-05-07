import Component, {mixins} from "vue-class-component";
import CourseNavigationComponent from '@webapp/course/course_navigation_component/course_navigation_component.vue';
import {mapState} from 'vuex';
import CourseDetailsComponent from "@webapp/course/course_details_component/course_details_component";
import {CourseMode} from "@webapp/course/course_store";
import {CourseStructureRouteGuardMixin} from "@webapp/course/course_route_guards";
import {RootGetters, RootState} from "@store/store_types";
import TrainingPanelComponent from '@training/training_panel/training_panel_component.vue';
import {FoundationOffCanvasMixin} from '@components/foundation/foundation_off_canvas_mixin';
import {IconComponentMixin} from '@components/icons/icon_component_mixin';
import {EDIT_TRAINING_MUTATIONS} from '@training/edit_training_store/edit_training_state';

@Component({
    computed: {
        ...mapState<RootState>({
            isCourseAdmin: (state, {currentCourseMode}: RootGetters) => currentCourseMode === CourseMode.ADMIN,
            hasEdits: (state, {hasEdits}: RootGetters) => hasEdits
        })
    },
    mixins: [CourseStructureRouteGuardMixin],
    components: {
        'course-navigation': CourseNavigationComponent,
        'course-details': CourseDetailsComponent,
        'training-panel': TrainingPanelComponent,
    }
})
export default class CourseComponent extends mixins(IconComponentMixin) {
    isHideCourseNavigation: boolean = true;
    isHideTrainingPanel: boolean = true;

    openCourseNavigation() {
        (<FoundationOffCanvasMixin>this.$refs.courseNavigationPanel).open();
        this.isHideCourseNavigation = false;
    }

    openTrainingPanel() {
        (<FoundationOffCanvasMixin>this.$refs.trainingPanel).open();
        this.isHideTrainingPanel = false;
    }

    onCloseCourseNavigation() {
        this.isHideCourseNavigation = true;
    }

    onCloseTrainingPanel() {
        this.isHideTrainingPanel = true;
    }

    resetAll(){
        this.$store.commit(EDIT_TRAINING_MUTATIONS.RESET_ALL)
    }
}
