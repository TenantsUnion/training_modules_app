import {NavigationGuard} from 'vue-router';
import {store} from '../state_store';
import {MODULE_ACTIONS} from '@module/store/module_actions';

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
    let courseSlug = to.params.courseSlug;
    if (!slug || slug === 'undefined' || !courseSlug || courseSlug === 'undefined') {
        throw new Error(`Invalid route ${to.fullPath}. Route param :moduleSlug must be defined`);
    }
    try {
        const mode = store.getters.getCourseModeFromId(store.state.course.currentCourseId);
        await store.dispatch(MODULE_ACTIONS.SET_CURRENT_MODULE_FROM_SLUG, {slug, mode});
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
