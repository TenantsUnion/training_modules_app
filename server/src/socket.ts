import * as socket from 'socket.io';
import socketWildcard from 'socketio-wildcard';
import {getLogger} from './log';
import {ADMIN_COURSE_NSP, SUBSCRIBE} from '../../shared/socket';

let socketServerLogger = getLogger('SocketServer', 'info');
let adminSocketLogger = getLogger('AdminCourseSocket', 'info');

export let io:SocketIO.Server;
export let adminCourseSocket;
export let rootSocket;

export const initSocket = (httpServer) => {
    io = socket.listen(httpServer);

    io.use(socketWildcard());
    rootSocket = io.of('/');

    adminCourseSocket = io.of(ADMIN_COURSE_NSP);

    io.on('connection', (socket: SocketIO.Socket) => {
        socketServerLogger.info(`Socket connected: ${socket.id}`);

        socket.on(SUBSCRIBE, (courseId) => {
            socketServerLogger.info(`Subscribing socket: ${socket.id} to course room: ${courseId}`);
            socket.join(courseId)
        });
    });

    io.on('disconnect', (socket: SocketIO.Socket) => {
       socketServerLogger.info(`Socket disconnected: ${socket.id}`);
    });

    adminCourseSocket.on('connection', (socket: SocketIO.Socket) => {
        adminSocketLogger.info(`Connected to admin course id: ${socket.id}`);

        socket.on(SUBSCRIBE, (courseId) => {
            adminSocketLogger.info(`Subscribing socket: ${socket.id} to course room: ${courseId}`);
            socket.join(courseId);
        });
    });

    socketServerLogger.info('Socket server initialized');
};
