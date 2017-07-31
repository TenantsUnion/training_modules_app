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
                    <span>Hello {{ username }}</span>
                    <button class="button button-secondary" @click="signout">
                        Sign Out
                    </button>
                </div>
            </div>
            <div class="small-3 cell">
                <span>Welcome, {{ username }}!</span>
                <button class="button secondary" @click>Log Out</button>
            </div>
        </div>`

})
export class AppHeader extends Vue {
    signout() {
        //todo hook up to server
        appRouter.push('/');
    }
}
