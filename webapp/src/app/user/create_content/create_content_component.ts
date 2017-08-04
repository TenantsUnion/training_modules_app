import Vue from "vue";
import Component from "vue-class-component";
import {QuillComponent} from "../../quill/quill_component";

@Component({
    data: () => {
        return {
            loading: false,
            errorMsg: '',
            title: ''
        };
    },
    // <div class="grid-y medium-grid-frame" style="justify-content: center;">
    //     <div class="grid-x grid-padding-x align-center">
    //         <div class="cell small-6">
    // language=HTML
    template: `
        <div class="grid-y small-grid-frame">
            <div class="grid-x grid-padding-x align-center">
                <div class="small-10 columns">
                    <div>
                        <h1>Create Content</h1>
                        <p v-if="loading">Loading...</p>
                        <p v-if="errorMsg">{{ errorMsg }}</p>
                    </div>
                    <div>
                        <label for="content-title">Title
                            <input v-model="title" type="text"
                                   placeholder="Content Title"
                                   id="content-title"/>
                        </label>
                    </div>
                    <div>
                        <quill-editor ref="editor"></quill-editor>
                    </div>
                </div>
            </div>
            <div>
                <button @click="create" class="button primary">Create
                </button>
            </div>
        </div>
    `,
    components: {
        'quill-editor': QuillComponent
    }
})
export class ContentComponent extends Vue {

    create () {

    }
}