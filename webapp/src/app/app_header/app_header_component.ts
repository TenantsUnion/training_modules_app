import Component from "vue-class-component";
import Vue from "vue";
import {appRouter} from "../router";

@Component({
    props: {
        username: String
    },
    // language=HTML
    template: `
        <div>
            <span>Hello {{ username }}</span>
            <button class="button button-secondary" @click="signout">Sign Out</button>
        </div>`
})
export class AppHeader extends Vue {
    signout(){
        //todo hook up to server
        appRouter.push('/');
    }
}
