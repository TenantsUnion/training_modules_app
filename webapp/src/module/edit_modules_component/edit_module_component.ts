import Vue from 'vue';
import draggable from 'vuedraggable';
import Component from 'vue-class-component';
import VueForm from '@webapp/types/vue-form';
import {SaveModuleEntityPayload, ViewModuleData} from '@shared/modules';
import {mapGetters, mapState} from 'vuex';
import {RootGetters, RootState} from '@store/store_types';
import {TrainingEntityDiffDelta, ViewTrainingEntityDescription} from '@shared/training_entity';
import {diffBasicPropsTrainingEntity} from '@shared/delta/diff_delta';
import {deltaArrayDiff} from '@shared/delta/diff_key_array';
import {Watch} from 'vue-property-decorator';
import EditTrainingSegmentsComponent from "@webapp/training/edit_training_segments/edit_training_segments_component";
import {ADMIN_COURSE_ROUTES, PREVIEW_COURSE_ROUTES} from "@webapp/global/routes";
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from "@webapp/global/status_messages/status_messages_store";
import {ModuleTrainingComponent} from "@webapp/training/training_components";
import {EDIT_COURSE_COMMAND_ACTIONS} from "@webapp/course/edit_course_command_store";

@Component({
    data: () => {
        return {
            errorMessages: null,
            formstate: {},
            module: null,
            saving: false,
            removeSections: {},
            sectionTitleStyleObject: {}
        };
    },
    computed: {
        ...mapGetters({
            getModuleSlugFromId: 'getModuleSlugFromId'
        }),
        ...mapState<RootState>({
            currentCourseId: ({course: {currentCourseId}}) => currentCourseId,
            currentModuleId: ({course: {currentModuleId}}) => currentModuleId,
            storedModule: (state, {currentTraining}: RootGetters) => currentTraining
        })
    },
    extends: ModuleTrainingComponent,
    components: {
        draggable
    }
})
export class EditModuleComponent extends Vue {
    saving: boolean;
    errorMessages: {};
    formstate: VueForm.FormState;
    storedModule: ViewModuleData;
    module: ViewModuleData;
    sections: ViewTrainingEntityDescription[] = [];
    currentCourseId: string;
    currentModuleId: string;
    removeSections: { [index: string]: boolean };
    getModuleSlugFromId: (id) => string;

    @Watch('storedModule', {immediate: true})
    updateModule (currentModule: ViewModuleData, oldCurrentModule) {
        if (currentModule) {
            let module = {...currentModule};
            Vue.set(this, 'sections', module.sections ? [...module.sections] : []);
            Vue.set(this, 'module', module);
        }
    }

    addSection() {
        this.$router.push({name: ADMIN_COURSE_ROUTES.createSection});
    }

    removeSection (section) {
        this.$set(this.removeSections, section.id, true);
    }

    cancelRemoveSection (section) {
        this.$set(this.removeSections, section.id, false);
    }

    async saveModule () {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        // primitive keys diff
        let changes: TrainingEntityDiffDelta = diffBasicPropsTrainingEntity(this.storedModule, this.module);

        let contentQuestions = (<EditTrainingSegmentsComponent> this.$refs.trainingSegment).getContentQuestionsDelta();

        let orderedSectionIds = this.sections
            .map(({id}) => id)
            .filter((id) => !this.removeSections[id]);

        let orderedSectionIdsDiff = deltaArrayDiff(this.storedModule.sections.map(({id}) => id), orderedSectionIds);

        let moduleEntityPayload: SaveModuleEntityPayload = {
            id: this.module.id,
            courseId: this.currentCourseId,
            changes: {
                ...changes,
                orderedSectionIds: orderedSectionIdsDiff,
            },
            contentQuestions
        };

        try {
            this.saving = true;
            await this.$store.dispatch(EDIT_COURSE_COMMAND_ACTIONS.SAVE_MODULE, moduleEntityPayload);
            let message: TitleMessagesObj = {message: `Module: ${this.module.title} saved successfully`};
            this.$store.dispatch(STATUS_MESSAGES_ACTIONS.SET_SUCCESS_MESSAGE, message);
            this.$router.push({
                name: PREVIEW_COURSE_ROUTES.modulePreview,
                params: {
                    moduleSlug: this.getModuleSlugFromId(this.currentModuleId)
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
        this.module.timeEstimate = time;
    }

    sectionTitleStyles (section: ViewTrainingEntityDescription) {
        return {
            "text-decoration": this.removeSections[section.id] ? "line-through" : "none"
        };
    }
}

export default EditModuleComponent;