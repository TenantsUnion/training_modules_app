import Vue from 'vue';
import Component from "vue-class-component";
import {ViewCourseData} from '@shared/courses';
import {Location} from 'vue-router/types/router';
import {mapGetters} from 'vuex';
import {ADMIN_COURSE_ROUTES, ENROLLED_COURSE_ROUTES, PREVIEW_COURSE_ROUTES} from "@global/routes";

@Component({
    data: () => {
        return {
            editCourse: {name: ADMIN_COURSE_ROUTES.editCourse},
            createModule: {name: ADMIN_COURSE_ROUTES.createModule},
            coursePreview: {name: PREVIEW_COURSE_ROUTES.coursePreview},
            editModule (moduleSlug: string): Location {
                return {
                    name: ADMIN_COURSE_ROUTES.editModule, params: {
                        moduleSlug: moduleSlug
                    }
                };
            },
            editSection (moduleSlug: string, sectionSlug: string): Location {
                return {
                    name: ADMIN_COURSE_ROUTES.editSection,
                    params: {
                        moduleSlug: moduleSlug,
                        sectionSlug: sectionSlug
                    }
                }
            },
            createSection (moduleSlug: string): Location {
                return {
                    name: ADMIN_COURSE_ROUTES.createSection, params: {
                        moduleSlug
                    }
                };
            },
            modulePreviewRoute (moduleTitle): Location {
                return {
                    name: PREVIEW_COURSE_ROUTES.modulePreview,
                    params: {
                        moduleSlug: moduleTitle
                    }
                };
            },
            sectionPreviewRoute (moduleSlug, sectionSlug): Location {
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
        ...mapGetters({
            course: 'courseNavigationDescription'
        })
    }
})
export default class CourseNavigationComponent extends Vue {
    course: ViewCourseData;
    isCourseAdmin: boolean;

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
