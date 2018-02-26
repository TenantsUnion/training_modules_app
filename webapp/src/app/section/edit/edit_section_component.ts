import Vue from 'vue';
import Component from 'vue-class-component';
import * as VueForm from '../../vue-form';
import {SaveSectionEntityPayload, ViewSectionData} from '@shared/sections';
import {CourseRefreshComponent} from '@global/refresh_route';
import {mapGetters, mapState} from 'vuex';
import {RootGetters, RootState} from '../../state_store';
import {currentSectionRouteGuard} from '../view/view_section_component';
import {Watch} from 'vue-property-decorator';
import {diffBasicPropsTrainingEntity} from '@shared/delta/diff_delta';
import {SECTION_ACTIONS} from '@section/store/section_actions';
import {TrainingEntityDiffDelta} from '@shared/training_entity';
import {getSectionSlugFromIdFn} from '@section/store/section_state';
import EditTrainingSegmentsComponent from "@global/edit_training_segments/edit_training_segments_component";
import {PREVIEW_COURSE_ROUTES} from "@global/routes";
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from "@global/status_messages/status_messages_store";

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
            storedSection: 'currentSection',
            getSectionSlugFromId: 'getSectionSlugFromId'
        }),
        ...mapState({
            loading: (state: RootState, getters: RootGetters) => {
                return !getters.currentSection || getters.currentSectionLoading
                    || getters.currentCourseLoading || getters.currentModuleLoading;
            },
            currentCourseId: ({course: {currentCourseId}}) => currentCourseId,
            currentModuleId: ({module: {currentModuleId}}) => currentModuleId,
        })
    },
    beforeRouteUpdate: currentSectionRouteGuard,
    beforeRouteEnter: currentSectionRouteGuard,
    extends: CourseRefreshComponent,
})
export default class EditSectionComponent extends Vue {
    saving: boolean;
    errorMessages: {};
    formstate: VueForm.FormState;
    section: ViewSectionData;
    storedSection: ViewSectionData;
    currentCourseId: string;
    currentModuleId: string;
    getSectionSlugFromId: getSectionSlugFromIdFn;

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
            await this.$store.dispatch(SECTION_ACTIONS.SAVE_SECTION, saveSectionPayload);
            let message: TitleMessagesObj = {message: `Section: ${this.section.title} saved successfully`};
            this.$store.dispatch(STATUS_MESSAGES_ACTIONS.SET_SUCCESS_MESSAGE, message);
            this.$router.push({
                name: PREVIEW_COURSE_ROUTES.sectionPreview,
                params: {
                    sectionSlug: this.getSectionSlugFromId({
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
