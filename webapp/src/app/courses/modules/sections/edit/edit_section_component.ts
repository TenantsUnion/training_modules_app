import * as _ from 'underscore';
import Vue from 'vue';
import Component from 'vue-class-component';
import * as VueForm from '../../../../vue-form';
import {SaveSectionEntityPayload, ViewSectionQuillData} from '@shared/sections';
import {CourseRefreshComponent} from '@global/refresh_route';
import {mapGetters, mapState} from 'vuex';
import {RootGetters, RootState} from '../../../../state_store';
import {currentSectionRouteGuard} from '../view/view_section_component';
import {Segment} from '@shared/segment';
import {COURSES_ROUTE_NAMES} from '../../../courses_routes';
import {Watch} from 'vue-property-decorator';
import {diffBasicPropsTrainingEntity} from '@shared/delta/diff_delta';
import {SECTION_ACTIONS} from '../../../store/section/section_actions';
import {deltaArrayDiff} from '@shared/delta/diff_key_array';
import {TrainingEntityDiffDelta} from '@shared/training_entity';
import {getSectionSlugFromIdFn} from '../../../store/section/section_state';

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
        ...mapGetters(['currentSection', 'getSectionSlugFromId']),
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
    template: require('./edit_section_component.tpl.html')
})
export class EditSectionComponent extends Vue {
    saving: boolean;
    errorMessages: {};
    quillContent: Segment[] = [];
    formstate: VueForm.FormState;
    section: ViewSectionQuillData;
    currentSection: ViewSectionQuillData;
    currentCourseId: string;
    currentModuleId: string;
    getSectionSlugFromId: getSectionSlugFromIdFn;

    @Watch('currentSection', {immediate: true})
    updateSection(currentSection: ViewSectionQuillData, oldCurrentSection) {
        let section = currentSection ? _.extend({}, currentSection) : this.section;
        let quillContent = currentSection ? _.map(currentSection.content, (content) => {
            return _.extend({}, content, {
                // add callback that removes content element from component array before passing to segment viewer
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
        let changes: TrainingEntityDiffDelta = diffBasicPropsTrainingEntity(this.currentSection, this.section);

        // quill content diff
        // todo use entire contentquestion changes
        // changes.quillChanges = (<TrainingSegmentComponent> this.$refs.trainingSegment).getQuillDiff();

        // ordered content ids diff
        let userChangedOrderedContentIds = this.quillContent.map(({id}) => id);
        let {orderedContentIds} = this.currentSection;
        changes.orderedContentIds = deltaArrayDiff(orderedContentIds, userChangedOrderedContentIds);
        // todo question handling
        changes.orderedContentQuestionIds = deltaArrayDiff(orderedContentIds, userChangedOrderedContentIds);

        let saveSectionPayload: SaveSectionEntityPayload = {
            id: this.section.id,
            courseId: this.currentCourseId,
            moduleId: this.currentModuleId,
            changes
        };

        try {
            this.saving = true;
            await this.$store.dispatch(SECTION_ACTIONS.SAVE_SECTION, saveSectionPayload);
            this.$router.push({
                name: COURSES_ROUTE_NAMES.viewSection,
                params: {
                    sectionSlug: this.getSectionSlugFromId({
                        sectionId: this.currentSection.id,
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

    timeEstimateUpdated(time) {
        this.section.timeEstimate = time;
    }

    addContentCallback(addContentId: string) {
        this.quillContent.push({
            id: addContentId,
            type: 'CONTENT',
        });
    }
}
