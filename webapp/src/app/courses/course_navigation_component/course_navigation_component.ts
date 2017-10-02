import Vue from 'vue';
import Component from "vue-class-component";
import {ViewCourseQuillData} from '../../../../../shared/courses';
import {RawLocation, RouteRecord} from 'vue-router/types/router';
import {COURSES_ROUTE_NAMES} from '../courses_routes';

@Component({
    data: () => {
        return {
            courseDetails: {
                name: 'adminCourse.courseDetails',
            } as RouteRecord
        }
    },
    props: {
        course: Object,
        isCourseAdmin: Boolean
    },
    template: require('./course_navigation_component.tpl.html'),
})
export class CourseNavigationComponent extends Vue {
    course: ViewCourseQuillData;
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
            name: 'adminCourse.moduleDetails',
            params: {
                moduleTitle: moduleTitle
            }
        };
    }

    sectionRoute(moduleTitle, sectionTitle): RawLocation {
        return {
            name: COURSES_ROUTE_NAMES.viewSection,
            params: {
                moduleTitle: moduleTitle,
                sectionTitle: sectionTitle
            }
        }
    }

    editCourse() {
        this.$router.push({
            name: COURSES_ROUTE_NAMES.editCourse, params: {
                courseTitle: this.course.title
            }
        });
    }

    editModule(moduleTitle: string) {

    }

    editSection(moduleTitle: string, sectionTitle: string) {
        this.$router.push({
            name: COURSES_ROUTE_NAMES.editSection,
            params: {
                sectionTitle: sectionTitle
            }
        })
    }

    createSection(moduleTitle: string) {
        this.$router.push({
            name: COURSES_ROUTE_NAMES.createSection, params: {
                moduleTitle: moduleTitle
            }
        });
    }

    isActiveSection(moduleTitle: string, sectionTitle: string) {
        return this.$route.params.moduleTitle === moduleTitle
            && this.$route.params.sectionTitle === sectionTitle;
    }
}