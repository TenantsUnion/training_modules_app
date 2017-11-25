import {setCourseSubscription} from './admin_course_socket';

// break circular dependency between state store of course actions using admin course socket and admin course socket using state actions to dispatch
export const subscribeCourse = (courseId: string) => {
    setCourseSubscription(courseId);
};
