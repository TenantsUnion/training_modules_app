import Vue from 'vue';
import Component from 'vue-class-component';
import {coursesRoutesService} from '../../../courses_routes';
import {coursesService} from '../../../courses_service';
import {ViewSectionQuillData} from '../../../../../../../shared/sections';
import {CourseRefreshComponent} from '../../../../global/refresh_route';
import {NavigationGuard} from 'vue-router';
import {SECTION_ACTIONS} from '../../../store/section/section_actions';
import {RootGetters, RootState, store} from '../../../../state_store';
import {MODULE_ACTIONS} from '../../../store/module/module_actions';
import {mapGetters, mapState} from 'vuex';

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
    computed: {
        ...mapGetters({
            section: 'currentSection',
            isCourseAdmin: 'isAdmin',
        }),
        ...mapState({
            loading: (state: RootState, getters: RootGetters) => {
                return !getters.currentSection || getters.currentSectionLoading
                    || getters.currentCourseLoading || getters.currentModuleLoading;
            }
        })
    },
    beforeRouteUpdate: currentSectionRouteGuard,
    beforeRouteEnter: currentSectionRouteGuard,
    extends: CourseRefreshComponent,
    template: require('./view_section_component.tpl.html')
})
export class ViewSectionComponent extends Vue {
    next() {

    }

    back() {
    }
}