import Vue from "vue";
import Component from "vue-class-component";
import {QuillComponent} from "../../../quill/quill_component";
import * as VueForm from "../../../vue-form";
import {coursesService} from "../../courses_service";
import {CourseData} from "courses";

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
export class CreateModuleComponent extends Vue {
    loading: boolean;
    errorMessages: { [index: string]: string };
    title: string;
    timeEstimate: string;
    description: string;
    quillEditor: QuillComponent;
    formstate: VueForm.FormState;
    course: CourseData;

    created() {
        this.loading = true;
        coursesService.subscribeCurrentCourse((course) => {
            this.loading = false;
            this.course = course;
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
                    courseId: this.course.id,
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