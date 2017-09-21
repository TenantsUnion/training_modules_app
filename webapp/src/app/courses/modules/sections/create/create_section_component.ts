import Component from 'vue-class-component';
import {QuillComponent} from '../../../../quill/quill_component';
import * as Vue from 'vue';
import * as VueForm from '../../../../vue-form';
import {CourseData} from '../../../../../../../shared/courses';
import {coursesService} from '../../../courses_service';
import {ModuleData} from '../../../../../../../shared/modules';

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: null,
            title: '',
            timeEstimate: '',
            description: '',
            formstate: {}
        }
    },
    components: {
        'quill-editor': QuillComponent
    },
    template: require('./create_module_component.tpl.html')
})
export class CreateSectionComponent extends Vue {
    loading: boolean;
    errorMessages: { [index: string]: string };
    title: string;
    timeEstimate: string;
    description: string;
    quillEditor: QuillComponent;
    formstate: VueForm.FormState;
    module: ModuleData;

    created() {
        this.loading = true;
        coursesService.subscribeCurrentModule((module) => {
            this.loading = false;
            this.module = module;
        });
    }

    mounted() {
        this.quillEditor = <QuillComponent> this.$refs.editor;
    }

    createModule() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        let quillData: Quill.DeltaStatic = this.quillEditor.getQuillEditorContents();
        this.loading = true;
        this.errorMessages = null;

        (async () => {

            try {
                await coursesService.createModule({
                    courseId: this.module.id,
                    title: this.title,
                    description: this.description,
                    timeEstimate: this.timeEstimate,
                    header: quillData
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
