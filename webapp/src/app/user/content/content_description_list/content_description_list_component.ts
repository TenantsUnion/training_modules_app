import Component from "vue-class-component";
import Vue from "vue";
import * as VueRouter from "vue-router";
import {contentHttpService} from "../content_http_service";
import {ContentDescriptionEntity} from "content";

@Component({
    data: () => {
        return {
            loading: false,
            errorMsg: '',
            contentDescriptionList: []
        }
    },
    template: require('./content_description_list_component.tpl.html')
})
export class ContentDescriptionListComponent extends Vue {
    $router: VueRouter;
    loading: boolean;
    errorMsg: string;
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
            .catch((errorMsg) => {
                this.errorMsg = errorMsg;
                this.loading = false;
            });
    }

    createNewContent () {
        this.$router.push('content/create');
    }

}