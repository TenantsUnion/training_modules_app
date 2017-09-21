import Vue from 'vue';
import Component from "vue-class-component";
import {CourseData} from '../../../../../shared/courses';
import {RawLocation, RouteRecord} from 'vue-router/types/router';

require('./_course_navigation_component.scss');

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
    course: CourseData;
    isCourseAdmin: boolean;

    isActiveModule(moduleName: string): boolean {
        return this.$route.params.module === moduleName;
    }

    goToModule(title: string): void {
        this.$router.push('title')
    }

    createModule() {
        this.$router.push({
            name: 'adminCourse.createModule',
        })
    }

    get activeModule():string {
        return this.$route.params.moduleTitle;
    }

    moduleDetailsRoute(moduleTitle): RawLocation {
        return {
            name: 'adminCourse.moduleDetails',
            params: {
                moduleTitle: moduleTitle
            }
        };
    }
}