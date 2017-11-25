import Vue from 'vue';
import Component from 'vue-class-component';
import {coursesService} from '../../../courses_service';
import * as VueForm from '../../../../vue-form';
import {COURSES_ROUTE_NAMES} from '../../../courses_routes';
import {ViewSectionQuillData} from '../../../../../../../shared/sections';
import * as _ from "underscore";
import {CourseRefreshComponent} from '../../../../global/refresh_route';
import {QuillComponent} from '../../../../global/quill/quill_component';
import {mapGetters} from 'vuex';

@Component({
    data: () => {
        return {
            section: {
                title: '',
                description: '',
                timeEstimate: ''
            },
            loading: false,
            errorMessages: null,
            formstate: {}
        };
    },
    computed: {
        ...mapGetters(['currentSection', 'currentSectionLoading'])
    },
    extends: CourseRefreshComponent,
    template: require('./edit_section_component.tpl.html')
})
export class EditSectionComponent extends Vue {
    loading: boolean;
    errorMessages: { [index: string]: string };
    formstate: VueForm.FormState;
    section: ViewSectionQuillData;
    sectionUnsubscribe;

    created() {

        // this.loading = true;
        //
        // this.sectionUnsubscribe = coursesService.subscribeCurrentSection((section) => {
        //     this.loading = false;
        //     this.section = _.extend({}, section);
        // });
    }

    destroyed() {
        this.sectionUnsubscribe();
    }

    async saveSection() {
        // todo delete
        // this.formstate._submit();
        // if (this.formstate.$invalid) {
        //     return;
        // }
        //
        // this.loading = true;
        // this.errorMessages = null;
        //
        // let course = await coursesService.getCurrentCourse();
        // let module = await coursesService.getCurrentModule();
        //
        // try {
        //     await coursesService.saveSection({
        //         id: this.section.id,
        //         courseId: course.id,
        //         moduleId: module.id,
        //         title: this.section.title,
        //         description: this.section.description,
        //         timeEstimate: this.section.timeEstimate,
        //         content: [{
        //             // support more than 1 quill content but just present 1 for now
        //             id: this.section.content[0].id,
        //             editorJson: (<QuillComponent> this.$refs.editor).getQuillEditorContents()
        //         }]
        //     });
        //     this.$router.push({
        //         name: COURSES_ROUTE_NAMES.viewSection,
        //         params: {sectionTitle: this.section.title}
        //     });
        //
        // } catch (errorMessages) {
        //     console.error(errorMessages);
        //     this.errorMessages = errorMessages;
        // } finally {
        //     this.loading = false;
        // }
    }

    timeEstimateUpdated(time) {
        this.section.timeEstimate = time;
    }
}
