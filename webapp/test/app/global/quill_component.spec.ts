import {expect} from 'chai';
import {createdQuillPlaceholderId} from '@shared/quill_editor';
import VueQuillComponent from '@global/quill/quill_component.vue';
import QuillComponent from '@global/quill/quill_component';
import Delta from 'quill-delta';
import DeltaOperation = Quill.DeltaOperation;

describe('Quill Component', () => {
    it('should keep track of changes starting from blank delta with no editorJson property', () => {
        const component: QuillComponent = new VueQuillComponent({
            propsData: {
                editorId: createdQuillPlaceholderId()
            }
        });
        component.$mount();

        component.quill.insertText(0, 'Test text', 'user');
        let quillChanges = component.getChanges();

        const value = new Delta().insert('Test text');
        expect(quillChanges.ops).to.deep.eq(value.ops);
        component.$destroy();
    });

    it('should keep track of changes starting from 3 lines of quill data', () => {
        const firstLine = `Some starting text.\n`;
        const startingLines = `That is on multiple lines.\nThis starts as the last line\n`;
        const startingText = `${firstLine}${startingLines}`;
        const startingDelta = new Delta().insert(startingText);
        const insertText = `insert this text after first line\n`;

        const component: QuillComponent = new VueQuillComponent({
            propsData: {
                editorId: createdQuillPlaceholderId(),
                editorJson: startingDelta
            }
        });
        component.$mount();

        component.quill.insertText(firstLine.length, insertText, 'user');
        expect(component.getChanges().ops).to.deep.eq(<DeltaOperation[]>[
            {
               retain: 20
            },
            {
                insert: insertText
            }
        ]);
        expect(component.quill.getText()).to.eq(`${firstLine}${insertText}${startingLines}`);
        component.$destroy();
    });
});
