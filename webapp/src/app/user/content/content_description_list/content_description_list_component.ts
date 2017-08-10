import Component from "vue-class-component";
import Vue from "vue";
import * as VueRouter from "vue-router";
import {contentHttpService} from "../content_http_service";
import {ContentDescriptionEntity} from "content";

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: {},
            contentDescriptionList: []
        }
    },
    template: require('./content_description_list_component.tpl.html')
})
export class ContentDescriptionListComponent extends Vue {
    errorMessages: object;
    $router: VueRouter;
    loading: boolean;
    contentDescriptionList: ContentDescriptionEntity[];

    created () {
        this.fetchContentDescriptionList();
    }

    edit (content: ContentDescriptionEntity) {
        this.$router.push({
            path: `content/${content.id}/edit`,
            params: {
                contentId: content.id
            }
        });
    }

    watch () {
        return {
            '$route': this.fetchContentDescriptionList()
        };
    }

    fetchContentDescriptionList () {
        this.loading = true;
        contentHttpService.getContentDescriptionList()
            .then((content) => {
                this.contentDescriptionList = content;
                this.loading = false;
            })
            .catch((errorMessages) => {
                this.errorMessages = errorMessages;
                this.loading = false;
            });
    }

    createNewContent () {
        this.$router.push('content/create');
    }

}