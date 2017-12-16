import Vue from 'vue';
import draggable from 'vuedraggable';
import Component from 'vue-class-component';
import * as VueForm from '../../../vue-form';
import {ViewModuleQuillData} from 'modules.ts';
import {ViewSectionTransferData} from 'sections.ts';
import {CourseRefreshComponent} from '../../../global/refresh_route';

@Component({
    data: () => {
        return {
            module: {
                title: null,
                description: null,
                headerContent: {}
            },
            removeSections: {},
            sectionTitleStyleObject: {},
            loading: false,
            errorMessages: null,
            formstate: {}
        };
    },
    extends: CourseRefreshComponent,
    template: require('./edit_module_component.tpl.html'),
    components: {
        draggable
    }
})
export class EditModuleComponent extends Vue {
    loading: boolean;
    errorMessages: { [index: string]: string };
    timeEstimate: string;
    description: string;
    formstate: VueForm.FormState;
    module: ViewModuleQuillData;
    private moduleSections: ViewSectionTransferData[] = [];
    removeSections: { [index: string]: boolean };
    isCourseAdmin: boolean;
    moduleUnsubscribe: () => void;

    created() {
        // todo delete
        // this.loading = true;
        // this.moduleUnsubscribe = coursesService.subscribeCurrentModule((module) => {
        //     this.loading = false;
        //     this.module = _.extend({}, module);
        //     this.moduleSections = _.extend([], module.sections);
        // });
        // this.isCourseAdmin = coursesRoutesService.isCourseAdmin();
    }

    destroyed() {
        this.moduleUnsubscribe();
    }

    removeSection(section) {
        this.$set(this.removeSections, section.id, true);
    }

    cancelRemoveSection(section) {
        this.$set(this.removeSections, section.id, false);
    }

    async saveModule() {
        // todo delete
        // this.formstate._submit();
        // if (this.formstate.$invalid) {
        //     return;
        // }
        //
        // this.loading = true;
        // this.errorMessages = null;
        //
        // let course = await coursesservice.getcurrentcourse();
        //
        // await coursesService.saveModule({
        //     courseId: course.id,
        //     id: this.module.id,
        //     title: this.module.title,
        //     orderedSectionIds: _.map(this.moduleSections, (section) => section.id),
        //     description: this.module.description,
        //     timeEstimate: this.module.timeEstimate,
        //     headerContent: (<QuillComponent> this.$refs.editor).getQuillEditorContents(),
        //     headerContentId: this.module.headerContent.id,
        //     removeSectionIds: Object.keys(this.removeSections).filter((sectionId) => this.removeSections[sectionId]),
        //     active: this.module.active
        // });
        // this.loading = false;
        // this.$router.push({
        //     name: 'adminCourse.moduleDetails',
        //     params: {moduleTitle: this.module.title}
        // });
    }

    timeEstimateUpdated(time) {
        this.module.timeEstimate = time;
    }

    sectionTitleStyles(section: ViewSectionTransferData) {
        return {
            "text-decoration": this.removeSections[section.id] ? "line-through" : "none"
        };
    }

}