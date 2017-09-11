import Vue from "vue";
import Component from "vue-class-component";
import {QuillComponent} from "../../../quill/quill_component";
import * as VueForm from "../../../vue-form";
import {modulesService} from "../modules_service";
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

    created () {
        this.fetchData();
    }

    mounted () {
        this.quillEditor = <QuillComponent> this.$refs.editor;
    }

    async fetchData (): Promise<void> {
        coursesService.getCurrentCourse()
            .then((currentCourse) => {
                this.course = currentCourse;
                return <CourseData> currentCourse;
            })
            .catch((errorMessages) => {
                this.errorMessages = errorMessages;
                throw errorMessages
            });
    }

    createModule () {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        let quillData: Quill.DeltaStatic = this.quillEditor.getQuillEditorContents();
        this.loading = true;
        this.errorMessages = null;

        (async () => {

            try {

                await this.fetchData();
                await modulesService.createModule({
                    courseId: this.course.id,
                    title: this.title,
                    description: this.description,
                    timeEstimate: this.timeEstimate,
                    header: quillData
                });
                // to do now what
                this.$router.push('')

            } catch (errorMessages){
                this.errorMessages = errorMessages;
            } finally {
                this.loading = false;
            }

        })();
    }
}