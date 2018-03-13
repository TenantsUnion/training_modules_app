import Vue from 'vue';
import Component from "vue-class-component";
import {ViewCourseData} from '@shared/courses';
import {Location} from 'vue-router/types/router';
import {mapGetters, mapState} from 'vuex';
import {ADMIN_COURSE_ROUTES, ENROLLED_COURSE_ROUTES, PREVIEW_COURSE_ROUTES} from "@global/routes";
import {RootGetters, RootState} from "@webapp_root/store";
import {CourseMode} from "@course/course_store";

@Component({
    data: () => {
        return {
            createModule: {name: ADMIN_COURSE_ROUTES.createModule},
            coursePreview: {name: PREVIEW_COURSE_ROUTES.coursePreview},
            createSection (moduleSlug: string): Location {
                return {
                    name: ADMIN_COURSE_ROUTES.createSection, params: {
                        moduleSlug
                    }
                };
            },
            previewModule (moduleSlug): Location {
                return {
                    name: PREVIEW_COURSE_ROUTES.modulePreview,
                    params: {
                        moduleSlug: moduleSlug
                    }
                };
            },
            previewSection (moduleSlug, sectionSlug): Location {
                return {
                    name: PREVIEW_COURSE_ROUTES.sectionPreview,
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
            isAdmin: function(state: RootState, getters: RootGetters){
                return getters.currentCourseMode === CourseMode.ADMIN;
            }
        }),
        ...mapGetters({
            course: 'courseNavigationDescription'
        })
    }
})
export default class CourseNavigationComponent extends Vue {
    course: ViewCourseData;
    isAdmin: boolean;

    courseRoute (): Location {
        return {
            name: this.isAdmin ? ADMIN_COURSE_ROUTES.editCourse : PREVIEW_COURSE_ROUTES.coursePreview
        }

    }

    moduleRoute (moduleSlug: string): Location {
        return {
            name: this.isAdmin ? ADMIN_COURSE_ROUTES.editModule : PREVIEW_COURSE_ROUTES.modulePreview,
            params: {
                moduleSlug: moduleSlug
            }
        };
    }

    sectionRoute (moduleSlug: string, sectionSlug: string): Location {
        return {
            name: this.isAdmin ? ADMIN_COURSE_ROUTES.editSection : PREVIEW_COURSE_ROUTES.sectionPreview,
            params: {
                moduleSlug: moduleSlug,
                sectionSlug: sectionSlug
            }
        }
    }

    get activeNavigation () {
        return {
            // highlight course item
            course:
            this.$route.name === ADMIN_COURSE_ROUTES.editCourse
            || this.$route.name === PREVIEW_COURSE_ROUTES.coursePreview
            || this.$route.name === ADMIN_COURSE_ROUTES.createModule
            || this.$route.name === ENROLLED_COURSE_ROUTES.enrolledCourse,
            module: this.$route.params.moduleSlug,
            section: this.$route.params.sectionSlug
        };
    }

    isActiveSection (moduleSlug: string, sectionSlug: string) {
        return this.$route.params.moduleSlug === moduleSlug
            && this.$route.params.sectionSlug === sectionSlug;
    }
}
