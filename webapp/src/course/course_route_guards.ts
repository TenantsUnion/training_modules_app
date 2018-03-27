import {store} from "@store/store";
import {NavigationGuard} from "vue-router";
import {COURSE_ACTIONS} from "@webapp/course/course_store";
import {Vue} from "vue/types/vue";

const undefinedParam = (param): boolean => !param || param === 'undefined';
const courseStructureRouteGuard: NavigationGuard = async function (this: Vue, to: any, from: any, next) {
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
                sectionSlug, moduleId: this.$store.state.course.currentModuleId
            });
        }
    } catch (e) {
        console.error(`Error setting current course, module, section from route. ${e}`);
    } finally {
        next();
    }
};

export const CourseStructureRouteGuardMixin = {
    beforeRouteEnter: courseStructureRouteGuard,
    beforeRouteUpdate: courseStructureRouteGuard
};


