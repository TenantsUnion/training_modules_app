import Component from "vue-class-component";
import Vue from "vue";
import {appRouter} from "../../router";

@Component({
    props: {
        username: String
    },
    // language=HTML
    template: `
        <div class="grid-x">
            <div class="small-9 cell">
                <div>
                    <router-link :to="{name:'courses'}">Courses</router-link>
                    <router-link :to="{name:'content'}">Content</router-link>
                </div>
            </div>
            <div class="small-3 cell">
                <span>Welcome, {{ username }}!</span>
                <button class="button secondary" @click="signout">Sign Out
                </button>
            </div>
        </div>`

})
export class AppHeader extends Vue {
    signout() {
        //todo hook up to server
        appRouter.push('/');
    }
}
