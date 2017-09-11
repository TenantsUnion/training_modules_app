import Vue from 'vue';
import Component from "vue-class-component";
import {ModuleDetails} from '../../../../../shared/modules';
import {CourseDescription} from '../../../../../shared/courses';
import {coursesService} from '../courses_service';
import {userQueryService} from '../../account/user_query_service';
import {CreateModuleComponent} from "../modules/create_module_component/create_module_component";

require('./_course_navigation_component.scss');

@Component({
    props: {
        modules: Object,
        courseTitle: String,
        isCourseAdmin: Boolean
    },
    template: require('./course_navigation_component.tpl.html'),
})
export class CourseNavigationComponent extends Vue {
    modules: ModuleDetails[];
    courseTitle: string;
    isCourseAdmin: boolean;
    activeModule: string;

    created () {
    }

    isActiveModule (moduleName: string): boolean {
        return this.$route.params.module === moduleName;
    }

    goToModule (title: string): void {
        this.activeModule = title;
        this.$router.push('title')
    }

    createModule () {
        this.$router.push(`${this.courseTitle}/module/create`)
    }
}