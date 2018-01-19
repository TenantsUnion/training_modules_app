import Vue from "vue";
import Component from "vue-class-component";
import * as VueForm from "../../../vue-form";
import {MODULE_ACTIONS, ModuleActions} from '../../store/module/module_actions';
import {Segment} from '../../../../../../shared/segment';
import {COURSES_ROUTE_NAMES} from '../../courses_routes';
import {SegmentViewerComponent} from '../../../global/segment_viewer/segment_viewer_component';

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
    errorMessages: {};
    loading: boolean;
    title: string;
    timeEstimate: string;
    description: string;
    formstate: VueForm.FormState;
    quillContent: Segment[] = [];


    async createModule() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.loading = true;
        this.errorMessages = null;

        try {
            let createModulePayload = {
                title: this.title,
                description: this.description,
                timeEstimate: this.timeEstimate,
                courseId: this.$store.state.course.currentCourseId,
                orderedContentQuestions: (<SegmentViewerComponent> this.$refs.segmentViewer).getContents(),
            };
            await this.$store.dispatch(MODULE_ACTIONS.CREATE_MODULE, createModulePayload);

            this.$router.push({
                name: COURSES_ROUTE_NAMES.moduleDetails,
                params: {moduleSlug: this.$store.getters.getModuleSlugFromId(this.$store.state.module.currentModuleId)}
            });
        } catch (errorMessages) {
            console.error(errorMessages);
            // todo check if error message object from server and display, if not print stack trace since it is likely a client thrown error
            this.errorMessages = errorMessages;
        } finally {
            this.loading = false;
        }
    }

    timeEstimateUpdated(time) {
        this.timeEstimate = time;
    }

    addContentCallback(addContentId: string) {
        this.quillContent.push({
            id: addContentId,
            type: 'CONTENT',
        });
    }
}