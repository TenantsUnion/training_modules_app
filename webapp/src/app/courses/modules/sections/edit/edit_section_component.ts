import Component from 'vue-class-component';
import {QuillComponent} from '../../../../quill/quill_component';
import Vue from 'vue';
import {coursesService} from '../../../courses_service';
import * as VueForm from '../../../../vue-form';
import {COURSES_ROUTE_NAMES} from '../../../courses_routes';
import {SectionData} from '../../../../../../../shared/sections';

@Component({
    data: () => {
        return {
            section: {},
            loading: false,
            errorMessages: null,
            title: '',
            timeEstimate: '',
            description: '',
            formstate: {}
        };
    },
    components: {
        'quill-editor': QuillComponent
    },
    template: require('./edit_section_component.tpl.html')
})
export class EditSectionComponent extends Vue {
    loading: boolean;
    errorMessages: { [index: string]: string };
    title: string;
    timeEstimate: string;
    description: string;
    quillEditor: QuillComponent;
    formstate: VueForm.FormState;
    section: SectionData;
    currentSectionLoaded: Promise<SectionData>;

    created() {
        this.loading = true;
        this.currentSectionLoaded = coursesService.getCurrentSection();
    }

    mounted() {
        this.quillEditor = <QuillComponent> this.$refs.editor;
        this.currentSectionLoaded.then((section) => {
           this.loading = false;
           this.section = section;
           this.quillEditor.setQuillEditorContents(this.section.content[0].editorJson);
        });


    }

    saveSection() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        let quillData: Quill.DeltaStatic = this.quillEditor.getQuillEditorContents();
        this.loading = true;
        this.errorMessages = null;

        (async () => {

            let course = await coursesService.getCurrentCourse();
            let module = await coursesService.getCurrentModule();

            try {
                await coursesService.createSection({
                    title: this.title,
                    courseId: course.id,
                    moduleId: module.id,
                    description: this.description,
                    timeEstimate: this.timeEstimate,
                    quillData: quillData
                });
                // to do now what
                this.$router.push({
                    name: COURSES_ROUTE_NAMES.viewSection,
                    params: {sectionTitle: this.title}
                });

            } catch (errorMessages) {
                this.errorMessages = errorMessages;
            } finally {
                this.loading = false;
            }

        })();
    }
}
