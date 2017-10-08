import Component from "vue-class-component";
import Vue from "vue";
import {appRouter} from "../../router";
import {Route} from "vue-router";

@Component({
    props: {
        username: String
    },
    // language=HTML
    template: `
        <div class="user-header-wrapper">
            <nav class="row">
                <div class="menu-section columns">
                    <ul class="menu menu-section__menu">
                        <li v-bind:class="{'is-active': adminCoursesActive}">
                            <router-link :to="{name: 'adminCourses'}">
                                Admin Courses
                            </router-link>
                        </li>
                        <li v-bind:class="{'is-active': enrolledCoursesActive}">
                            <router-link :to="{name: 'enrolledCourses'}">
                                Enrolled Courses
                            </router-link>
                        </li>
                        <li v-bind:class="{'is-active': contentActive}">
                            <router-link :to="{name:'content'}">Content
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="menu-section columns shrink user-actions">
                    <span class="welcome-message">Welcome, {{ username }}!</span>
                    <button class="button secondary" @click="signout">Sign
                        Out
                    </button>
                </div>
            </nav>
        </div>
    `

})
export class AppHeader extends Vue {
    $route: Route;

    get enrolledCoursesActive () {
        return this.$route.path.indexOf('enrolled-courses') != -1;
    }

    get adminCoursesActive () {
        return this.$route.path.indexOf('admin-courses') != -1;
    }

    get contentActive () {
        return this.$route.path.indexOf('/content') != -1;
    }

    signout () {
        //todo hook up to server
        appRouter.push('/');
    }
}
