import * as socketIOClient from 'socket.io-client';
import {ADMIN_COURSE_NSP, SUBSCRIBE} from '../../../../shared/socket';
import {ViewCourseTransferData} from '../../../../shared/courses';
import {coursesService} from './courses_service';

export const adminCourseSocket = socketIOClient.connect(ADMIN_COURSE_NSP);

adminCourseSocket.on('connect', function(){
   console.log('Admin course socket connected');
});
/**
 * Emitting the {@link SUBSCRIBE} event with the provided course id is handled by the socket server
 * by subscribing the {@link adminCourseSocket} to room with the provided courseId
 *
 * @param courseId
 */
export const setCourseSubscription = (courseId) => {
    // unsubscribing from previous course is handled by socket server
    adminCourseSocket.emit(SUBSCRIBE, courseId, ()=> {
        console.log()
    });
};

/**
 * Notifies the {@link coursesService} that the current course has been updated
 */
adminCourseSocket.on('message', async (data: ViewCourseTransferData) => {
    try {
        console.log('Received update from admin course socket');
        console.log(data);
        await coursesService.notifyCourseUpdate(data);
    } catch (e) {
        console.error(e);
    }
});







