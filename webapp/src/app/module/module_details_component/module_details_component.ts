import Vue from 'vue';
import Component from "vue-class-component";
import {mapGetters, mapState} from 'vuex';
import {NavigationGuard} from 'vue-router';
import {ADMIN_COURSE_ROUTES} from "@global/routes";
import {store} from "../../state_store";
import {MODULE_ACTIONS} from "../store/module_actions";
import {CourseMode} from "@course/store/course_mutations";

export const currentModuleRouteGuard: NavigationGuard = async (to, from, next) => {
    let slug = to.params.moduleSlug;
    if (!slug || slug === 'undefined') {
        throw new Error(`Invalid route ${to.fullPath}. Route param :moduleSlug must be defined`);
    }
    try {
        await store.dispatch(MODULE_ACTIONS.SET_CURRENT_MODULE_FROM_SLUG, {slug, mode: store.getters.mode});
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
            module: 'currentModule',
        }),
        ...mapState({
            isCourseAdmin: ({course: {mode}}) => {
                return mode === CourseMode.ADMIN
            }
        })
    },
    beforeRouteUpdate: currentModuleRouteGuard,
    beforeRouteEnter: currentModuleRouteGuard
})
export default class ModuleDetailsComponent extends Vue {
    loading: boolean;

}

