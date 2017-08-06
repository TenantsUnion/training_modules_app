import Component from "vue-class-component";
import Vue from "vue";
import {appRouter} from "../../router";


require('./_user_header_component.scss');

@Component({
    props: {
        username: String
    },
    // language=HTML
    template: `
        <div class="user-header-wrapper">
            <div class="inner">
                <nav class="grid-x">
                    <div class="menu-section cell small-9 align-middle">
                        <ul class="menu">
                            <li><router-link :to="{name:'courses'}">Courses</router-link></li>
                            <li><router-link :to="{name:'content'}">Content</router-link></li>
                        </ul>
                    </div>
                    <div class="menu-section auto cell align-middle user-actions">
                        <span>Welcome, {{ username }}!</span>
                        <button class="button secondary" @click="signout">Sign Out
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    `

})
export class AppHeader extends Vue {
    signout() {
        //todo hook up to server
        appRouter.push('/');
    }
}
