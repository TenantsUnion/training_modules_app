import Vue from 'vue';
import Component from "vue-class-component";
import {COURSES_ROUTE_NAMES} from '../../courses_routes';
import {mapGetters, mapState} from 'vuex';
import {NavigationGuard} from 'vue-router';
import {RootState, store} from '../../../state_store';
import {MODULE_ACTIONS} from '../../store/module/module_actions';

export const currentModuleRouteGuard: NavigationGuard = async (to, from, next) => {
    let slug = to.params.moduleSlug;
    if (!slug || slug === 'undefined') {
        throw new Error(`Invalid route ${to.fullPath}. Route param :moduleSlug must be defined`);
    }
    try {
        await store.dispatch(MODULE_ACTIONS.SET_CURRENT_MODULE_FROM_SLUG, slug);
    } catch (e) {
        console.error(`Error setting current course. ${e}`);
    } finally {
        next();
    }
};
@Component({
    computed: {
        ...mapGetters({
            loading: 'currentModuleLoading',
            module: 'currentModule'
        }),
        ...mapState({
            isCourseAdmin: (state:RootState) => state.course.isAdmin
        })
    },
    beforeRouteUpdate: currentModuleRouteGuard,
    beforeRouteEnter: currentModuleRouteGuard
})
export default class ModuleDetailsComponent extends Vue {
    loading: boolean;

    createSection() {
        this.$router.push({name: COURSES_ROUTE_NAMES.createSection});
    }
}

