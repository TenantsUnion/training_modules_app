import Vue from 'vue';
import Component from "vue-class-component";
import {coursesService} from '../../courses_service';
import {COURSES_ROUTE_NAMES, coursesRoutesService} from '../../courses_routes';
import {ViewModuleQuillData} from '../../../../../../shared/modules';
import {CourseRefreshComponent} from '../../../global_components/refresh_route';
import {QuillComponent} from '../../../quill/quill_component';

@Component({
    data: () => {
        return {
            module: {},
            isCourseAdmin: false
        };
    },
    extends: CourseRefreshComponent,
    template: require('./module_details_component.tpl.html'),
    components: {
        'quill-editor': QuillComponent
    }
})

export class ModuleDetailsComponent extends Vue {
    moduleUnsubscribe: () => any;
    quillEditor: QuillComponent;
    loading: boolean;
    isCourseAdmin: boolean;
    module: ViewModuleQuillData;

    created() {
        this.loading = true;
        this.isCourseAdmin = coursesRoutesService.isCourseAdmin();
        this.moduleUnsubscribe = coursesService.subscribeCurrentModule((module) => {
            this.loading = false;
            this.module = module;
            this.quillEditor &&
                 this.quillEditor.setQuillEditorContents(this.module.headerContent.editorJson);
        });
    }

    mounted() {
        this.quillEditor = <QuillComponent> this.$refs.editor;
        if(this.module && this.module.headerContent) {
            this.quillEditor.setQuillEditorContents(this.module.headerContent.editorJson);
        }
    }

    createSection(){
        this.$router.push({name: COURSES_ROUTE_NAMES.createSection});
    }

    destroyed() {
        this.moduleUnsubscribe();
    }
}