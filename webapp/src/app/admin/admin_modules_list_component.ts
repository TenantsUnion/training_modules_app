import Vue from "vue";
import Component from "vue-class-component";
import {modulesHttpService} from "./modules/admin_modules_http_service";
import {AdminModuleData} from "modules";

@Component({
    data: () => {
        return {
            loading: false,
            modules: null,
            error: null
        }
    },
    // language=HTML
    template: `
        <div>
            <p>Modules List</p>
            <div v-if="loading">
                Loading...
            </div>
            <div v-if="error">
                {{error}}
            </div>
            <div v-if="modules">
                <ul>
                    <li v-for="module in modules">
                        <span>{{ module.name }} {{ module.visible }}</span>
                        <button class="button primary" @click="edit(module.id)">Edit</button>
                    </li>
                </ul>
            </div>
        </div>
    `
})
export class AdminModulesList extends Vue {
    loading: boolean;
    modules: AdminModuleData[];
    error: string;

    created() {
        this.fetchModules();
    }

    fetchModules() {
        this.loading = true;
        modulesHttpService.getModules()
            .then((modules) => {
                this.loading = false;
                this.modules = modules;
            }).catch((errorMessage: string) => {
                this.error = errorMessage;
            }
        );
    }

    edit(moduleId: string){
    }
}