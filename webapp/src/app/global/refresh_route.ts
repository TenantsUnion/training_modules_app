import {coursesService} from '../courses/courses_service';
/**
 * Triggers a refresh of the current course when the route changes needed in order to update components that aren't
 * created or destroyed from a certain route change that changes the course (module and section included) data being
 * shown.
 */


export const CourseRefreshComponent = {
    watch: {
        // todo delete
        // '$route': () => coursesService.refresh().then(() => {})
    }
};
