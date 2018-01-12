import * as _ from 'underscore';
import Vue from 'vue';
import draggable from 'vuedraggable';
import Component from 'vue-class-component';
import * as VueForm from '../../../vue-form';
import {SaveModuleEntityPayload, ViewModuleQuillData} from 'modules.ts';
import {ViewSectionTransferData} from 'sections.ts';
import {CourseRefreshComponent} from '../../../global/refresh_route';
import {mapGetters, mapState} from 'vuex';
import {RootGetters, RootState} from '../../../state_store';
import {currentModuleRouteGuard} from '../module_details_component/module_details_component';
import {Segment} from '../../../../../../shared/segment';
import {TrainingEntityDiffDelta} from '../../../../../../shared/training_entity';
import {diffBasicPropsTrainingEntity} from '../../../../../../shared/delta/diff_delta';
import {SegmentViewerComponent} from '../../../global/segment_viewer/segment_viewer_component';
import {deltaArrayDiff} from '../../../../../../shared/delta/diff_key_array';
import {MODULE_ACTIONS} from '../../store/module/module_actions';
import {COURSES_ROUTE_NAMES} from '../../courses_routes';
import {getModuleSlugFromIdFn} from '../../store/module/module_state';
import {Watch} from 'vue-property-decorator';

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
        ...mapGetters(['currentModule', 'getModuleSlugFromId']),
        ...mapState({
            loading: (state: RootState, getters: RootGetters) => {
                return !getters.currentModule || getters.currentModuleLoading
                    || getters.currentCourseLoading || getters.currentModuleLoading;
            },
            currentCourseId: ({course: {currentCourseId}}) => currentCourseId,
            currentModuleId: ({module: {currentModuleId}}) => currentModuleId
        })
    },
    beforeRouteUpdate: currentModuleRouteGuard,
    beforeRouteEnter: currentModuleRouteGuard,
    extends: CourseRefreshComponent,
    template: require('./edit_module_component.tpl.html'),
    components: {
        draggable
    }
})
export class EditModuleComponent extends Vue {
    saving: boolean;
    errorMessages: {};
    quillContent: Segment[] = [];
    formstate: VueForm.FormState;
    module: ViewModuleQuillData;
    currentModule: ViewModuleQuillData;
    moduleSections: ViewSectionTransferData[] = [];
    currentCourseId: string;
    currentModuleId: string;
    removeSections: { [index: string]: boolean };
    getModuleSlugFromId: getModuleSlugFromIdFn;

    @Watch('currentModule', {immediate: true})
    updateModule(currentModule: ViewModuleQuillData, oldCurrentModule) {
        let module = currentModule ? _.extend({}, currentModule) : this.module;
        let quillContent = currentModule ? _.map(currentModule.content, (content) => {
            return _.extend({}, content, {
                // add callback that removes content element from component array before passing to segment viewer
                removeCallback: () => {
                    let rmIndex = this.quillContent.findIndex((el) => el.id === content.id);
                    this.quillContent.splice(rmIndex, 1);
                }
            });
        }) : [];
        let moduleSections = currentModule ? _.extend([], currentModule.sections) : [];
        Vue.set(this, 'quillContent', quillContent);
        Vue.set(this, 'moduleSections', moduleSections);
        Vue.set(this, 'module', module);
    }

    removeSection(section) {
        this.$set(this.removeSections, section.id, true);
    }

    cancelRemoveSection(section) {
        this.$set(this.removeSections, section.id, false);
    }

    async saveModule() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }


        // primitive keys diff
        let changes: TrainingEntityDiffDelta = diffBasicPropsTrainingEntity(this.currentModule, this.module);

        // quill content diff
        changes.quillChanges = (<SegmentViewerComponent> this.$refs.segmentViewer).getContentChanges();

        // ordered content ids diff
        let userChangedOrderedContentIds = this.quillContent.map(({id}) => id);
        let {orderedContentIds} = this.currentModule;
        changes.orderedContentIds = deltaArrayDiff(orderedContentIds, userChangedOrderedContentIds);
        // todo question handling
        changes.orderedContentQuestionIds = deltaArrayDiff(orderedContentIds, userChangedOrderedContentIds);

        // todo calculate section id change operations
        let orderedSectionIds = this.moduleSections
            .map(({id}) => id)
            .filter((id) => !this.removeSections[id]);

        let orderedSectionIdsDiff = deltaArrayDiff(this.$store.getters.currentModule.orderedSectionIds, orderedSectionIds);

        let moduleEntityPayload: SaveModuleEntityPayload = {
            id: this.module.id,
            courseId: this.currentCourseId,
            changes: {
                ...changes,
                orderedSectionIds: orderedSectionIdsDiff
            }
        };

        try {
            this.saving = true;
            await this.$store.dispatch(MODULE_ACTIONS.SAVE_MODULE, moduleEntityPayload);
            this.$router.push({
                name: COURSES_ROUTE_NAMES.moduleDetails,
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

    timeEstimateUpdated(time) {
        this.module.timeEstimate = time;
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

    sectionTitleStyles(module: ViewSectionTransferData) {
        return {
            "text-decoration": this.removeSections[module.id] ? "line-through" : "none"
        };
    }

}