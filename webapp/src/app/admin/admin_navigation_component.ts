import Vue from 'vue';
import Component from "vue-class-component";
import {Location} from "vue-router";

interface IAdminNavigationData {
    modulesLocation: Location,
    usersLocation: Location
}

@Component({
    data: (): IAdminNavigationData => {
        return {
            modulesLocation: {
                name: 'admin.modules'
            },
            usersLocation: {
                name: 'admin.users'
            }
        };
    },
    // language=HTML
    template: `
        <div>
            <ul class="tabs" role="tablist">
                <li class="tabs-title active" role="presentation">
                    <router-link role="tab" :to="modulesLocation">Modules
                    </router-link>
                </li>
                <li class="tabs-title" role="presentation">
                    <router-link role="tab" :to="usersLocation">Users
                    </router-link>
                </li>
            </ul>
            <div class="tabs-content">
                <div role="tabpanel" aria-hidden="false" class="content active">
                    <slot>Content from parent should be here!!!!</slot>
                </div>
            </div>
        </div>
    `
})
export class AdminNavigation extends Vue {
}

