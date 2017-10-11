import Component from 'vue-class-component';
import {QuillComponent} from '../../../../quill/quill_component';
import Vue from 'vue';
import {coursesService} from '../../../courses_service';
import * as VueForm from '../../../../vue-form';
import {COURSES_ROUTE_NAMES} from '../../../courses_routes';
import {ViewSectionQuillData} from '../../../../../../../shared/sections';
import {CourseRefreshComponent} from '../../../../global_components/refresh_route';

@Component({
    data: () => {
        return {
            section: {},
            loading: false,
            errorMessages: null,
            formstate: {}
        };
    },
    extends: CourseRefreshComponent,
    components: {
        'quill-editor': QuillComponent
    },
    template: require('./edit_section_component.tpl.html')
})
export class EditSectionComponent extends Vue {
    loading: boolean;
    errorMessages: { [index: string]: string };
    quillEditor: QuillComponent;
    formstate: VueForm.FormState;
    section: ViewSectionQuillData;
    currentSectionLoaded: Promise<ViewSectionQuillData>;

    created() {
        this.loading = true;
        this.currentSectionLoaded = coursesService.getCurrentSection();
    }

    mounted() {
        this.quillEditor = <QuillComponent> this.$refs.editor;
        this.currentSectionLoaded.then((section) => {
            this.loading = false;
            this.section = section;
            this.quillEditor.setQuillEditorContents(this.section.content[0].editorJson);
        });


    }

    saveSection() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        let quillData: Quill.DeltaStatic = this.quillEditor.getQuillEditorContents();
        this.loading = true;
        this.errorMessages = null;

        (async () => {
            let course = await coursesService.getCurrentCourse();
            let module = await coursesService.getCurrentModule();

            try {
                await coursesService.saveSection({
                    id: this.section.id,
                    courseId: course.id,
                    moduleId: module.id,
                    title: this.section.title,
                    description: this.section.description,
                    timeEstimate: this.section.timeEstimate,
                    content: [{
                        id: this.section.content[0].id,
                        editorJson: quillData
                    }]

                });
                // to do now what
                this.$router.push({
                    name: COURSES_ROUTE_NAMES.viewSection,
                    params: {sectionTitle: this.section.title}
                });

            } catch (errorMessages) {
                this.errorMessages = errorMessages;
            } finally {
                this.loading = false;
            }

        })();
    }
}
