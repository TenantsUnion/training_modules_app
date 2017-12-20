import {NavigationGuard} from 'vue-router';
import {store} from '../state_store';
import {MODULE_ACTIONS} from '../courses/store/module/module_actions';

/**
 * Triggers a refresh of the current course when the route changes needed in order to update components that aren't
 * created or destroyed from a certain route change that changes the course (module and section included) data being
 * shown.
 */


export const CourseRefreshComponent = {
    watch: {
        // todo delete
        // '$route': () => coursesService.refresh().then(() => {})
    }
};

const currentModuleRouteGuard: NavigationGuard = async (to, from, next) => {
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

export const ModuleRefreshComponent = {
    beforeRouteUpdate: currentModuleRouteGuard,
    beforeRouteEnter: currentModuleRouteGuard
};
