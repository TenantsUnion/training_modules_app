import Vue from 'vue';
import draggable from 'vuedraggable';
import Component from 'vue-class-component';
import {CourseRefreshComponent} from '../../../global_components/refresh_route';
import {QuillComponent} from '../../../quill/quill_component';
import * as VueForm from '../../../vue-form';
import * as _ from 'underscore';
import {coursesService} from '../../courses_service';
import {coursesRoutesService} from '../../courses_routes';
import {ViewModuleQuillData} from 'modules';
import {ViewSectionTransferData} from 'sections';

@Component({
    data: () => {
        return {
            module: {
                title: '',
                description: '',
                timeEstimate: ''
            },
            removeSections: {},
            sectionTitleStyleObject: {},
            loading: false,
            errorMessages: null,
            formstate: {}
        }
    },
    extends: CourseRefreshComponent,
    template: require('./edit_module_component.tpl.html'),
    components: {
        'quill-editor': QuillComponent,
        draggable
    }
})
export class EditModuleComponent extends Vue {
    loading: boolean;
    errorMessages: { [index: string]: string };
    timeEstimate: string;
    description: string;
    quillEditor: QuillComponent;
    formstate: VueForm.FormState;
    module: ViewModuleQuillData;
    private moduleSections: ViewSectionTransferData[] = [];
    removeSections: { [index: string]: boolean };
    isCourseAdmin: boolean;
    moduleUnsubscribe: () => void;

    created() {
        this.loading = true;
        this.moduleUnsubscribe = coursesService.subscribeCurrentModule((module) => {
            this.loading = false;
            this.module = _.extend({}, module);
            if (this.quillEditor) {
                this.quillEditor.setQuillEditorContents(this.module.headerContent.editorJson);
            }
            this.moduleSections = _.extend([], module.sections);
        });
        this.isCourseAdmin = coursesRoutesService.isCourseAdmin();
    }

    destroyed() {
        this.moduleUnsubscribe();
    }

    mounted() {
        this.quillEditor = <QuillComponent> this.$refs.editor;
        if (this.module.headerContent) {
            this.quillEditor.setQuillEditorContents(this.module.headerContent.editorJson);
        }
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

        let quillData: Quill.DeltaStatic = this.quillEditor.getQuillEditorContents();
        this.loading = true;
        this.errorMessages = null;

        let course = await coursesService.getCurrentCourse();

        await coursesService.saveModule({
            courseId: course.id,
            id: this.module.id,
            title: this.module.title,
            orderedSectionIds: _.map(this.moduleSections, (section) => section.id),
            description: this.module.description,
            timeEstimate: this.module.timeEstimate,
            headerContent: quillData,
            headerContentId: this.module.headerContent.id,
            removeSectionIds: Object.keys(this.removeSections).filter((sectionId) => this.removeSections[sectionId]),
            active: this.module.active
        });
        this.loading = false;
        this.$router.push({
            name: 'adminCourse.moduleDetails',
            params: {moduleTitle: this.module.title}
        });
    }

    sectionTitleStyles(section: ViewSectionTransferData) {
        return {
            "text-decoration": this.removeSections[section.id] ? "line-through" : "none"
        };
    }

}