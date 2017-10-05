import Vue from 'vue';
import Component from 'vue-class-component';
import {QuillComponent} from '../../../../quill/quill_component';
import {coursesRoutesService} from '../../../courses_routes';
import {coursesService} from '../../../courses_service';
import {ViewSectionQuillData} from '../../../../../../../shared/sections';
import {CourseRefreshComponent} from '../../../../global_components/refresh_route';

@Component({
    data: () => {
        return {
            loading: false,
            section: {}
        };
    },
    extends: CourseRefreshComponent,
    template: require('./view_section_component.tpl.html'),
    components: {
        'quill-editor': QuillComponent
    }
})
export class ViewSectionComponent extends Vue {
    loading: boolean;
    isCourseAdmin: boolean;
    sectionUnsubscribe: () => any;
    section: ViewSectionQuillData;

    created() {
        this.loading = true;
        this.isCourseAdmin = coursesRoutesService.isCourseAdmin();
        this.sectionUnsubscribe = coursesService.subscribeCurrentSection((section) => {
            this.loading = false;
            this.section = section;
        });
    }

    destroyed() {
        this.sectionUnsubscribe();
    }

    next() {
    }

    back() {
    }
}