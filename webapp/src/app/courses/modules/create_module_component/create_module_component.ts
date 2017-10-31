import Vue from "vue";
import Component from "vue-class-component";
import {QuillComponent} from "../../../quill/quill_component";
import * as VueForm from "../../../vue-form";
import {coursesService} from "../../courses_service";
import {ViewCourseQuillData} from "courses";

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
    template: require('./create_module_component.tpl.html')
})
export class CreateModuleComponent extends Vue {
    loading: boolean;
    errorMessages: { [index: string]: string };
    title: string;
    timeEstimate: string;
    description: string;
    formstate: VueForm.FormState;
    course: ViewCourseQuillData;

    created() {
        this.loading = true;
        coursesService.subscribeCurrentCourse((course) => {
            this.loading = false;
            this.course = course;
        });
    }

    async createModule() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.loading = true;
        this.errorMessages = null;


        try {
            await coursesService.createModule({
                courseId: this.course.id,
                title: this.title,
                description: this.description,
                timeEstimate: this.timeEstimate,
                header: (<QuillComponent> this.$refs.editor).getQuillEditorContents()
            });

            //todo handle validation errors
            this.$router.push({
                name: 'adminCourse.moduleDetails',
                params: {moduleTitle: this.title}
            });

        } catch (errorMessages) {
            this.errorMessages = errorMessages;
        } finally {
            this.loading = false;
        }
    }

    timeEstimateUpdated(time) {
        this.timeEstimate = time;
    }
}