import Vue from 'vue';
import Component from "vue-class-component";
import {COURSES_ROUTE_NAMES} from '../../courses_routes';
import {ViewModuleQuillData} from '../../../../../../shared/modules';
import {CourseRefreshComponent} from '../../../global/refresh_route';

@Component({
    data: () => {
        return {
            module: {
                title: null,
                description: null,
                timeEstimate: null,
                headerContent: {}
            },
            isCourseAdmin: false
        };
    },
    extends: CourseRefreshComponent,
    template: require('./module_details_component.tpl.html')
})
export class ModuleDetailsComponent extends Vue {
    moduleUnsubscribe: () => any;
    loading: boolean;
    isCourseAdmin: boolean;
    module: ViewModuleQuillData;

    created() {
        // todo delete
        // this.loading = true;
        // this.isCourseAdmin = coursesRoutesService.isCourseAdmin();
        // this.moduleUnsubscribe = coursesService.subscribeCurrentModule((module) => {
        //     this.loading = false;
        //     this.module = module;
        // });
    }

    createSection(){
        this.$router.push({name: COURSES_ROUTE_NAMES.createSection});
    }

    destroyed() {
        this.moduleUnsubscribe();
    }
}