import Vue from 'vue';
import Component from "vue-class-component";
import {ViewCourseData} from '@shared/courses';
import {RawLocation, RouteRecord} from 'vue-router/types/router';
import {COURSES_ROUTE_NAMES} from '../courses_routes';
import {mapGetters} from 'vuex';

@Component({
    data: () => {
        return {
            courseDetails: {
                name: 'adminCourse.courseDetails',
            } as RouteRecord
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

    get activeNavigation() {
        return {
            course: this.$route.name === COURSES_ROUTE_NAMES.adminCourseDetails, //todo enrolled course details
            module: this.$route.params.moduleTitle,
            section: this.$route.params.sectionTitle
        };
    }

    goToModule(title: string): void {
        this.$router.push('title')
    }

    createModule() {
        this.$router.push({name: COURSES_ROUTE_NAMES.createModule})
    }

    moduleDetailsRoute(moduleTitle): RawLocation {
        return {
            name: COURSES_ROUTE_NAMES.moduleDetails,
            params: {
                moduleSlug: moduleTitle
            }
        };
    }

    sectionRoute(moduleSlug, sectionSlug): RawLocation {
        return {
            name: COURSES_ROUTE_NAMES.viewSection,
            params: {
                moduleSlug: moduleSlug,
                sectionSlug: sectionSlug
            }
        }
    }

    editCourse() {
        this.$router.push({name: COURSES_ROUTE_NAMES.editCourse});
    }

    editModule(moduleSlug: string) {
        this.$router.push({
            name: COURSES_ROUTE_NAMES.editModule, params: {
                moduleSlug: moduleSlug
            }
        })
    }

    editSection(moduleSlug: string, sectionSlug: string) {
        this.$router.push({
            name: COURSES_ROUTE_NAMES.editSection,
            params: {
                moduleSlug: moduleSlug,
                sectionSlug: sectionSlug
            }
        })
    }

    createSection(moduleSlug: string) {
        this.$router.push({
            name: COURSES_ROUTE_NAMES.createSection, params: {
                moduleSlug
            }
        });
    }

    isActiveSection(moduleTitle: string, sectionTitle: string) {
        return this.$route.params.moduleTitle === moduleTitle
            && this.$route.params.sectionTitle === sectionTitle;
    }
}
