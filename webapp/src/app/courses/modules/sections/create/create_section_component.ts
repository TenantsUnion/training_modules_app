import Component from 'vue-class-component';
import Vue from 'vue';
import {coursesService} from '../../../courses_service';
import * as VueForm from '../../../../vue-form';
import {COURSES_ROUTE_NAMES} from '../../../courses_routes';
import {QuillComponent} from '../../../../global/quill/quill_component';
import {Segment} from '../../../../../../../shared/segment';
import {SegmentViewerComponent} from '../../../../global/segment_viewer/segment_viewer_component';
import {SECTION_ACTIONS} from '../../../store/section/section_actions';
import {CreateSectionEntityPayload} from '../../../../../../../shared/sections';
import {currentModuleRouteGuard} from '../../module_details_component/module_details_component';

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
    beforeRouteEnter: currentModuleRouteGuard,
    beforeRouteUpdate: currentModuleRouteGuard,
    template: require('./create_section_component.tpl.html')
})
export class CreateSectionComponent extends Vue {
    errorMessages: { [index: string]: string };
    loading: boolean;
    title: string;
    timeEstimate: string;
    description: string;
    formstate: VueForm.FormState;
    quillContent: Segment[] = [];

    async createSection() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.loading = true;
        this.errorMessages = null;

        let {currentModuleId} = this.$store.state.module;
        try {
            const createSectionPayload: CreateSectionEntityPayload = {
                title: this.title,
                description: this.description,
                timeEstimate: this.timeEstimate,
                courseId: this.$store.state.course.currentCourseId,
                moduleId: currentModuleId,
                orderedContentQuestions: (<SegmentViewerComponent> this.$refs.segmentViewer).getContents(),
            };
            await this.$store.dispatch(SECTION_ACTIONS.CREATE_SECTION, createSectionPayload);

            let {getSectionSlugFromId} = this.$store.getters;
            let {currentSectionId} = this.$store.state.section;
            this.$router.push({
                name: COURSES_ROUTE_NAMES.viewSection,
                params: {
                    sectionSlug: getSectionSlugFromId({moduleId: currentModuleId, sectionId: currentSectionId})
                },
            });
        } catch (errorMessages) {
            console.error(errorMessages);
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
            removeCallback: () => {
                let rmIndex = this.quillContent.findIndex((el) => el.id === addContentId);
                this.quillContent.splice(rmIndex, 1);
            }
        });
    }
}
