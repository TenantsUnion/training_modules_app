import Vue from "vue";
import Component from "vue-class-component";
import * as VueForm from "../../../vue-form";
import {coursesService} from "../../courses_service";
import {ViewCourseQuillData} from "courses.ts";
import {QuillComponent} from '../../../global/quill/quill_component';
import {MODULE_ACTIONS} from '../../store/module/module_actions';

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
        // todo delete
        // this.loading = true;
        // coursesService.subscribeCurrentCourse((course) => {
        //     this.loading = false;
        //     this.course = course;
        // });
    }

    async createModule() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.loading = true;
        this.errorMessages = null;

        // todo rewrite with store actions
        try {
            let createModulePayload = {
                title: this.title,
                description: this.description,
                timeEstimate: this.timeEstimate,
                courseId: this.course.id,
                orderedContentQuestions: []
            };
            await this.$store.dispatch(MODULE_ACTIONS.CREATE_MODULE, createModulePayload);

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