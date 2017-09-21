import Component from 'vue-class-component';
import {QuillComponent} from '../../../../quill/quill_component';
import Vue from 'vue';
import {coursesService} from '../../../courses_service';
import * as VueForm from '../../../../vue-form';

@Component({
    data: () => {
        return {
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
    template: require('./create_section_component.tpl.html')
})
export class CreateSectionComponent extends Vue {
    loading: boolean;
    errorMessages: { [index: string]: string };
    title: string;
    timeEstimate: string;
    description: string;
    quillEditor: QuillComponent;
    formstate: VueForm.FormState;

    created() {
        this.loading = false;
    }

    mounted() {
        this.quillEditor = <QuillComponent> this.$refs.editor;
    }

    createSection() {
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
                    name: 'adminCourse.moduleDetails',
                    params: {moduleTitle: this.title}
                });

            } catch (errorMessages) {
                this.errorMessages = errorMessages;
            } finally {
                this.loading = false;
            }

        })();
    }
}
