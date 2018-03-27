import socketIOClient from 'socket.io-client';
import {ADMIN_COURSE_NSP, SUBSCRIBE} from '@shared/socket';
import {CourseEntity} from '@shared/courses';

// export const adminCourseSocket = socketIOClient.connect(ADMIN_COURSE_NSP);
//
// adminCourseSocket.on('connect', function(){
//    console.log('Admin course socket connected');
// });
/**
 * Emitting the {@link SUBSCRIBE} event with the provided course id is handled by the socket server
 * by subscribing the {@link adminCourseSocket} to room with the provided courseId
 *
 * @param courseId
 */
export const setCourseSubscription = (courseId) => {
    // unsubscribing from previous course is handled by socket server
    // adminCourseSocket.emit(SUBSCRIBE, courseId, function () {
    //     console.log(`Admin socket subscribe callback ${courseId}`);
    //     console.log(arguments);
    // });
};

// adminCourseSocket.on('message', async (data: CourseEntity) => {
//     try {
//         console.log('Received update from admin course socket');
//         console.log(data);
//         //todo course action set course entity
//         // await appStore.dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, data);
//     } catch (e) {
//         console.error(e);
//     }
// });







