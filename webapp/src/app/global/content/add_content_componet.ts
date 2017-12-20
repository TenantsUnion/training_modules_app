import Vue from 'vue';
import Component from 'vue-class-component';
import {quillService} from '../quill/quill_service';
import {createdContentPlaceholderId} from '../../../../../shared/quill_editor';

@Component({
    props: {
        callback: {
            type: Function,
            required: true
        }
    },
    template: `
        <div>
            <button title="Add Content" type="button" class="button" v-on:click="addContent">
                Add Content
                <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
            </button>
        </div>
    `
})
export class AddContentComponent extends Vue {
    callback: (addContentId: string) => any;

    addContent() {
        this.callback(createdContentPlaceholderId());
    }
}