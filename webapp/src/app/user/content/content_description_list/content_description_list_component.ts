import Component from "vue-class-component";
import Vue from "vue";
import * as VueRouter from "vue-router";

@Component({
    data: () => {
        return {
            content: []
        }
    },
    template: require('./content_description_list_component.tpl.html')
})
export class ContentDescriptionListComponent extends Vue {
    $router: VueRouter;

    createNewContent(){
        this.$router.push('content/create')
    }

}