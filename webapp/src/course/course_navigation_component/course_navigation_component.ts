import Component, {mixins} from "vue-class-component";
import {ViewCourseData} from '@shared/courses';
import {Location} from 'vue-router/types/router';
import {mapGetters, mapState} from 'vuex';
import {ADMIN_COURSE_ROUTES, ENROLLED_COURSE_ROUTES, TRAINING_ROUTES} from "@webapp/global/routes";
import {RootGetters, RootState} from "@store/store_types";
import {CourseMode} from "@webapp/course/course_store";
import {FoundationOffCanvasMixin} from '@components/foundation/foundation_off_canvas_mixin';
import {IOffCanvasOptions} from 'foundation';

@Component({
    data: () => {
        return {
            createModule: {name: ADMIN_COURSE_ROUTES.createModule},
            coursePreview: {name: TRAINING_ROUTES.course},
            createSection(moduleSlug: string): Location {
                return {
                    name: ADMIN_COURSE_ROUTES.createSection, params: {
                        moduleSlug
                    }
                };
            },
            previewModule(moduleSlug): Location {
                return {
                    name: TRAINING_ROUTES.module,
                    params: {
                        moduleSlug: moduleSlug
                    }
                };
            },
            previewSection(moduleSlug, sectionSlug): Location {
                return {
                    name: TRAINING_ROUTES.section,
                    params: {
                        moduleSlug: moduleSlug,
                        sectionSlug: sectionSlug
                    }
                }
            },
        }
    },
    props: {
        isCourseAdmin: Boolean
    },
    computed: {
        ...mapState<RootState>({
            isAdmin: function (state: RootState, getters: RootGetters) {
                return getters.currentCourseMode === CourseMode.ADMIN;
            }
        }),
        ...mapGetters({
            course: 'courseNavigationDescription'
        })
    }
})
export default class CourseNavigationComponent extends mixins(FoundationOffCanvasMixin) {
    course: ViewCourseData;
    isAdmin: boolean;

    mounted() {
        this.open();
    }

    courseRoute(): Location {
        return {name: TRAINING_ROUTES.course}
    }

    moduleRoute(moduleSlug: string): Location {
        return {
            name: TRAINING_ROUTES.module,
            params: {
                moduleSlug: moduleSlug
            }
        };
    }

    sectionRoute(moduleSlug: string, sectionSlug: string): Location {
        return {
            name: TRAINING_ROUTES.section,
            params: {
                moduleSlug: moduleSlug,
                sectionSlug: sectionSlug
            }
        }
    }

    get activeNavigation() {
        return {
            // highlight course item
            course:
            this.$route.name === ADMIN_COURSE_ROUTES.editCourse
            || this.$route.name === TRAINING_ROUTES.course
            || this.$route.name === ADMIN_COURSE_ROUTES.createModule
            || this.$route.name === ENROLLED_COURSE_ROUTES.enrolledCourse,
            module: this.$route.params.moduleSlug,
            section: this.$route.params.sectionSlug
        };
    }

    isActiveSection(moduleSlug: string, sectionSlug: string) {
        return this.$route.params.moduleSlug === moduleSlug
            && this.$route.params.sectionSlug === sectionSlug;
    }


    get offCanvasConfig(): IOffCanvasOptions {
        return {
            contentOverlay: false,
            transition: 'push',
            contentScroll: false,
            autoFocus: true,
            trapFocus: false,
            closeOnClick: false
        };
    }
}
