import Component from 'vue-class-component';
import {QuillComponent} from '../../../../quill/quill_component';
import Vue from 'vue';
import {coursesService} from '../../../courses_service';
import * as VueForm from '../../../../vue-form';
import {COURSES_ROUTE_NAMES} from '../../../courses_routes';

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

    async createSection() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        let quillData: Quill.DeltaStatic = this.quillEditor.getQuillEditorContents();
        this.loading = true;
        this.errorMessages = null;

        try {
            let course = await coursesService.getCurrentCourse();
            let module = await coursesService.getCurrentModule();

            await coursesService.createSection({
                title: this.title,
                courseId: course.id,
                moduleId: module.id,
                description: this.description,
                timeEstimate: this.timeEstimate,
                content: quillData
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

    }
}
