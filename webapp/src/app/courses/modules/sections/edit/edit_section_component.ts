import * as _ from 'underscore';
import Vue from 'vue';
import Component from 'vue-class-component';
import * as VueForm from '../../../../vue-form';
import {SaveSectionEntityPayload, ViewSectionQuillData} from '../../../../../../../shared/sections';
import {CourseRefreshComponent} from '../../../../global/refresh_route';
import {mapGetters, mapState} from 'vuex';
import {RootGetters, RootState} from '../../../../state_store';
import {currentSectionRouteGuard} from '../view/view_section_component';
import {Segment} from '../../../../../../../shared/segment';
import {COURSES_ROUTE_NAMES} from '../../../courses_routes';
import {Watch} from 'vue-property-decorator';
import {diffPropsDeltaObj} from '../../../../../../../shared/delta/diff_delta';
import {SECTION_ACTIONS} from '../../../store/section/section_actions';
import {SegmentViewerComponent} from '../../../../global/segment_viewer/segment_viewer_component';
import {deltaArrayDiff} from '../../../../../../../shared/delta/diff_key_array';
import {TrainingEntityDiffDelta} from '../../../../../../../shared/training_entity';

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
        ...mapGetters(['currentSection']),
        ...mapState({
            loading: (state: RootState, getters: RootGetters) => {
                return !getters.currentSection || getters.currentSectionLoading
                    || getters.currentCourseLoading || getters.currentModuleLoading;
            }
        })
    },
    beforeRouteUpdate: currentSectionRouteGuard,
    beforeRouteEnter: currentSectionRouteGuard,
    extends: CourseRefreshComponent,
    template: require('./edit_section_component.tpl.html')
})
export class EditSectionComponent extends Vue {
    saving: boolean;
    errorMessages: { [index: string]: string };
    quillContent: Segment[] = [];
    formstate: VueForm.FormState;
    section: ViewSectionQuillData;
    currentSection: ViewSectionQuillData;

    @Watch('currentSection', {immediate: true})
    updateSection(currentSection: ViewSectionQuillData, oldCurrentSection) {
        let section = currentSection ? _.extend({}, currentSection) : this.section;
        let quillContent = currentSection ? _.map(currentSection.content, (content) => {
            return _.extend({}, content, {
                removeCallback: () => {
                    let rmIndex = this.quillContent.findIndex((el) => el.id === content.id);
                    this.quillContent.splice(rmIndex, 1);
                }
            });
        }) : [];
        Vue.set(this, 'section', section);
        Vue.set(this, 'quillContent', quillContent);
    }

    async saveSection() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.errorMessages = null;

        // primitive keys diff
        let changes: TrainingEntityDiffDelta = diffPropsDeltaObj(['title', 'description', 'timeEstimate'], this.currentSection, this.section);

        // quill content diff
        let quillContentChanges =(<SegmentViewerComponent> this.$refs.segmentViewer).getContentChanges();
        changes.changeQuillContent = quillContentChanges;

        // ordered content ids diff
        let userChangedContent = this.quillContent.map(({id}) => id);
        let orderedContentDiff = deltaArrayDiff(this.currentSection.orderedContentIds, userChangedContent);
        changes.orderedContentIds = orderedContentDiff;
        changes.orderedContentQuestionIds = orderedContentDiff;

        let saveSectionPayload: SaveSectionEntityPayload = {
            id: this.section.id,
            courseId: this.$store.state.course.currentCourseId,
            moduleId: this.$store.state.module.currentModuleId,
            changes
        };

        try {
            this.saving = true;
            await this.$store.dispatch(SECTION_ACTIONS.SAVE_SECTION, saveSectionPayload);
            this.$router.push({
                name: COURSES_ROUTE_NAMES.viewSection,
            });

        } catch (errorMessages) {
            console.error(errorMessages);
            this.errorMessages = errorMessages;
        } finally {
            this.saving = false;
        }
    }

    timeEstimateUpdated(time) {
        this.section.timeEstimate = time;
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
