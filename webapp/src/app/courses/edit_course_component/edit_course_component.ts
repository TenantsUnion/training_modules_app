import Vue from "vue";
import Component from "vue-class-component";
import {appRouter} from "../../router";
import {coursesService} from '../courses_service';
import {ViewCourseQuillData, SaveCourseData} from '../../../../../shared/courses';
import {COURSES_ROUTE_NAMES} from '../courses_routes';
import {userQueryService} from '../../account/user_query_service';

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: '',
            course: {}
        };
    },
    template: require('./edit_course_component.tpl.html')
})
export class EditCourseComponent extends Vue {
    errorMessages: {};
    loading: boolean;
    course: ViewCourseQuillData;

    created(){
        this.loading = true;
        coursesService.getCurrentCourse()
            .then((course) => {
                this.course = course;
                this.loading = false;
            })
    }

    save() {
        this.loading = true;
        let saveCourseData:SaveCourseData = {
          id: this.course.id,
            description: this.course.description,
            timeEstimate: this.course.timeEstimate,
            title: this.course.title,
            active: this.course.active,
            modules: this.course.modules.map((module) => module.id),
            updatedByUserId: userQueryService.getUserId()
        };
        coursesService.saveCourse(saveCourseData).then(()=>{
            appRouter.push({name: COURSES_ROUTE_NAMES.adminCourseDetails})
        }).catch((msg)=>{
            this.errorMessages = msg;
        })
    }

    cancel() {
        this.$router.push({name: COURSES_ROUTE_NAMES.adminCourseDetails})
    }

}
