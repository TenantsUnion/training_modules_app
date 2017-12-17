import Vue from 'vue';
import Component from 'vue-class-component';
import {quillService} from '../quill/quill_service';

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
    contentCounter = 0; // use to generate place holder ids for

    addContent() {
        this.callback('' + this.contentCounter++);
    }
}