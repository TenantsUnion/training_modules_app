import Component from "vue-class-component";
import Vue from "vue";
import {USER_ACTIONS} from '@webapp/user/store/user_store';
import {USER_ROUTES} from "@webapp/global/routes";

@Component({
    data: () => {
        return {
            adminCourses: {name: USER_ROUTES.adminCourses},
            enrolledCourses: {name: USER_ROUTES.enrolledCourses}
        }
    },
    props: {
        username: String
    },
})
export default class AppHeader extends Vue {
    get enrolledCoursesActive () {
        return this.$route.path.indexOf('enrolled-courses') != -1;
    }

    get adminCoursesActive () {
        return this.$route.path.indexOf('admin-courses') != -1;
    }

    get contentActive () {
        return this.$route.path.indexOf('/content') != -1;
    }

    async signout () {
        await this.$store.dispatch(USER_ACTIONS.LOGOUT);
        this.$router.push('/');
    }
}
