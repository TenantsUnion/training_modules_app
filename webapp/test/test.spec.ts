import QuillComponent from '../src/app/global/quill/quill_component.vue';
import {createdQuillPlaceholderId} from '@shared/quill_editor';

describe('Component', () => {
    it('is a Vue instance', () => {
        const component = new QuillComponent({
            propsData: {
                editorId: createdQuillPlaceholderId()
            }
        });
        component.$mount();

        // component.$el.
    });
});