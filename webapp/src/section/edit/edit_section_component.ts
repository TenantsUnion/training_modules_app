import Vue from 'vue';
import Component from 'vue-class-component';
import VueForm from '@webapp/types/vue-form';
import {SaveSectionEntityPayload, ViewSectionData} from '@shared/sections';
import {mapGetters, mapState} from 'vuex';
import {Watch} from 'vue-property-decorator';
import {diffBasicPropsTrainingEntity} from '@shared/delta/diff_delta';
import {TrainingEntityDiffDelta} from '@shared/training_entity';
import EditTrainingSegmentsComponent from "@webapp/training/edit_training_segments/edit_training_segments_component";
import {PREVIEW_COURSE_ROUTES} from "@webapp/global/routes";
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from "@webapp/global/status_messages/status_messages_store";
import {SectionTrainingComponent} from "@webapp/training/training_components";
import {EDIT_COURSE_COMMAND_ACTIONS} from "@webapp/course/edit_course_command_store";
import {RootState} from "@store/store_types";

@Component({
    data: () => {
        return {
            errorMessages: null,
            formstate: {},
            section: null,
            saving: false
        };
    },
    computed: {
        ...mapGetters({
            getSectionSlugFromId: 'getSectionSlugFromId'
        }),
        ...mapState<RootState>({
            loading: (state, {currentCourseLoading, trainingLoading}) => currentCourseLoading || trainingLoading,
            storedSection: (state, {currentTraining}) => currentTraining,
            currentCourseId: ({course: {currentCourseId}}) => currentCourseId,
            currentModuleId: ({course: {currentModuleId}}) => currentModuleId,
        })
    },
    extends: SectionTrainingComponent,
})
export default class EditSectionComponent extends Vue {
    saving: boolean;
    errorMessages: {};
    formstate: VueForm.FormState;
    section: ViewSectionData;
    storedSection: ViewSectionData;
    currentCourseId: string;
    currentModuleId: string;

    @Watch('storedSection', {immediate: true})
    updateSection (storedSection: ViewSectionData, oldCurrentSection) {
        if (storedSection) {
            let section = {...storedSection};
            Vue.set(this, 'section', section);
        }
    }

    async saveSection () {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.errorMessages = null;
        let changes: TrainingEntityDiffDelta = diffBasicPropsTrainingEntity(this.storedSection, this.section);
        let contentQuestions = (<EditTrainingSegmentsComponent> this.$refs.trainingSegment).getContentQuestionsDelta();

        let saveSectionPayload: SaveSectionEntityPayload = {
            id: this.section.id,
            courseId: this.currentCourseId,
            moduleId: this.currentModuleId,
            changes, contentQuestions
        };

        try {
            this.saving = true;
            await this.$store.dispatch(EDIT_COURSE_COMMAND_ACTIONS.SAVE_SECTION, saveSectionPayload);
            let message: TitleMessagesObj = {message: `Section: ${this.section.title} saved successfully`};
            this.$store.dispatch(STATUS_MESSAGES_ACTIONS.SET_SUCCESS_MESSAGE, message);
            this.$router.push({
                name: PREVIEW_COURSE_ROUTES.sectionPreview,
                params: {
                    sectionSlug: this.$store.getters.getSectionSlugFromId({
                        sectionId: this.section.id,
                        moduleId: this.currentModuleId
                    })
                }
            });
        } catch (errorMessages) {
            console.error(errorMessages);
            Vue.set(this, 'errorMessages', errorMessages);
        } finally {
            this.saving = false;
        }
    }

    timeEstimateUpdated (time) {
        this.section.timeEstimate = time;
    }
}
