import Vue from "vue"
import Component from "vue-class-component";
import CourseNavigationComponent from '@webapp/course/course_navigation_component/course_navigation_component.vue';
import {mapGetters, mapState} from 'vuex';
import CourseDetailsComponent from "@webapp/course/course_details_component/course_details_component";
import {CourseMode} from "@webapp/course/course_store";
import {CourseStructureRouteGuardMixin} from "@webapp/course/course_route_guards";
import {RootGetters, RootState} from "@store/store_types";
import TrainingPanelComponent from '@training/training_panel/training_panel_component.vue';
import {FoundationOffCanvasMixin} from '@components/foundation/foundation_off_canvas_mixin';


@Component({
    computed: {
        ...mapState<RootState>({
            isCourseAdmin: (state, {currentCourseMode}: RootGetters) => currentCourseMode === CourseMode.ADMIN
        }),
        ...mapGetters(['currentCourse', 'currentCourseLoading'])
    },
    mixins: [CourseStructureRouteGuardMixin],
    components: {
        'course-navigation': CourseNavigationComponent,
        'course-details': CourseDetailsComponent,
        'training-panel': TrainingPanelComponent

    }
})
export default class CourseComponent extends Vue {
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
}
