import Vue from 'vue';
import Component from 'vue-class-component';
import {coursesRoutesService} from '../../../courses_routes';
import {coursesService} from '../../../courses_service';
import {ViewSectionQuillData} from '../../../../../../../shared/sections';
import {CourseRefreshComponent} from '../../../../global/refresh_route';
import {NavigationGuard} from 'vue-router';
import {SECTION_ACTIONS} from '../../../store/section/section_actions';
import {store} from '../../../../state_store';
import {MODULE_ACTIONS} from '../../../store/module/module_actions';

const currentSectionRouteGuard: NavigationGuard = async (to, from, next) => {
    let moduleSlug = to.params.moduleSlug;
    let sectionSlug = to.params.sectionSlug;
    if (!moduleSlug || moduleSlug === 'undefined' || !sectionSlug || sectionSlug === 'undefined') {
        throw new Error(`Invalid route ${to.fullPath}. Route param :moduleSlug, :sectionSlug must be defined`);
    }
    try {
        await store.dispatch(MODULE_ACTIONS.SET_CURRENT_MODULE_FROM_SLUG, moduleSlug);
        await store.dispatch(SECTION_ACTIONS.SET_CURRENT_SECTION_FROM_SLUG, {
            sectionSlug,
            moduleId: store.state.module.currentModuleId
        });
    } catch (e) {
        console.error(`Error setting current course. ${e}`);
    } finally {
        next();
    }
};
@Component({
    data: () => {
        return {
            loading: false,
            section: {}
        };
    },
    extends: CourseRefreshComponent,
    template: require('./view_section_component.tpl.html')
})
export class ViewSectionComponent extends Vue {
    loading: boolean;
    isCourseAdmin: boolean;
    sectionUnsubscribe: () => any;
    section: ViewSectionQuillData;

    created() {
        // todo delete
        // this.loading = true;
        // this.isCourseAdmin = coursesRoutesService.isCourseAdmin();
        // this.sectionUnsubscribe = coursesService.subscribeCurrentSection((section) => {
        //     this.loading = false;
        //     this.section = section;
        // });
    }

    destroyed() {
        this.sectionUnsubscribe();
    }

    next() {
    }

    back() {
    }
}