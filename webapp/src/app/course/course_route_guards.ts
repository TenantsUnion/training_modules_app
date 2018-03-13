import {NavigationGuard} from "vue-router";
import {store} from "@webapp_root/app";
import {COURSE_ACTIONS} from "@course/course_store";

const undefinedParam = (param): boolean => !param || param === 'undefined';
export const currentCourseRouteGuard: NavigationGuard = async (to: any, from: any, next) => {
    let courseSlug = to.params.courseSlug;
    let moduleSlug = to.params.moduleSlug;
    let sectionSlug = to.params.sectionSlug;
    if (undefinedParam(courseSlug)) {
        throw new Error('Invalid route. :courseSlug must be defined');
    }
    try {
        await store.dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE_FROM_SLUG, courseSlug);
        if (moduleSlug) {
            await store.dispatch(COURSE_ACTIONS.SET_CURRENT_MODULE_FROM_SLUG, moduleSlug);
        }
        if (sectionSlug) {
            await store.dispatch(COURSE_ACTIONS.SET_CURRENT_SECTION_FROM_SLUG, {
                sectionSlug, moduleId: store.state.course.currentModuleId
            });
        }
    } catch (e) {
        console.error(`Error setting current course, module, section from route. ${e}`);
    } finally {
        next();
    }
};

