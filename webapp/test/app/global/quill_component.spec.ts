import {expect} from 'chai';
import VueQuillComponent from '@global/quill/quill_component.vue';
import QuillComponent from '@global/quill/quill_component';
import Delta from 'quill-delta';
import DeltaOperation = Quill.DeltaOperation;
import {ComponentOptions} from 'vue';
import {createdQuillPlaceholderId} from "@shared/ids";

describe('Quill Component', () => {
    let quillComponent: QuillComponent;

    // init and assign default QuillComponent
    const initQuillComponent = (options?: ComponentOptions<QuillComponent>): QuillComponent => {
        if (quillComponent) {
            // destroy old quill component if there is one
            quillComponent.$destroy();
        }
        let componentOptions = options || {
            propsData: {
                editorId: 'QD1'
            }
        };
        quillComponent = <QuillComponent> new VueQuillComponent(componentOptions);
        quillComponent.$mount();
        return quillComponent;
    };

    beforeEach(function () {
        initQuillComponent();
    });

    afterEach(function () {
        quillComponent.$destroy();
    });

    describe('getChanges', function () {
        it('should track changes starting from blank delta when there is no editorJson property', () => {
            quillComponent.quill.insertText(0, 'Test text', 'user');
            let quillChanges = quillComponent.getChanges();

            const value = new Delta().insert('Test text');
            expect(quillChanges.ops).to.deep.eq(value.ops);
        });

        it('should keep track of changes starting from 3 lines of quill data', () => {
            const firstLine = `Some starting text.\n`;
            const startingLines = `That is on multiple lines.\nThis starts as the last line\n`;
            const startingText = `${firstLine}${startingLines}`;
            const startingDelta = new Delta().insert(startingText);
            const insertText = `insert this text after first line\n`;
            initQuillComponent({
                propsData: {
                    editorJson: startingDelta,
                    editorId: createdQuillPlaceholderId()
                },
            });

            quillComponent.quill.insertText(firstLine.length, insertText, 'user');
            expect(quillComponent.getChanges().ops).to.deep.eq(<DeltaOperation[]>[
                {
                    retain: 20
                },
                {
                    insert: insertText
                }
            ]);
            expect(quillComponent.quill.getText()).to.eq(`${firstLine}${insertText}${startingLines}`);
        });
    });

    describe('hasChanged', function () {
        it('should return false when no changes have happened', function () {
            expect(quillComponent.hasChanged()).to.be.false;
        });

        it('should return false when changes cancel out', function () {
            let startingText = 'This is some starting text';
            let additionalText = 'some additional text';

            initQuillComponent({
                propsData: {
                    editorId: 'QU1',
                    editorJson: new Delta().insert(startingText)
                }
            });

            expect(quillComponent.hasChanged()).to.be.false;
            quillComponent.quill.insertText(startingText.length, additionalText, 'user');
            expect(quillComponent.hasChanged()).to.be.true;
            quillComponent.quill.deleteText(startingText.length, additionalText.length - 1, 'user');
            expect(quillComponent.hasChanged()).to.be.true;
            // finish removing added text
            quillComponent.quill.deleteText(startingText.length, 1, 'user');
            expect(quillComponent.hasChanged()).to.be.false;


        });

        it('should return true when changes have happened', function () {
            expect(quillComponent.hasChanged()).to.be.false;
            quillComponent.$destroy();
        });

        it('should return true when no changes have happened but the id is for a newly created quill object', function () {
            let component = initQuillComponent({propsData: {editorId: createdQuillPlaceholderId()}});
            expect(quillComponent.hasChanged()).to.be.true;

        });
    })
});
