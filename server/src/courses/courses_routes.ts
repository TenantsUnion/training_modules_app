import * as express from "express";
import {coursesController} from "../config/web_controller.config";

let router = express.Router();

router.get('/user/:username/courses/admin/:courseTitle', (request, response) => {
    coursesController.loadAdminCourse(request, response);
});


router.post('/courses/create', (request, response) => {
    coursesController.createCourse(request, response);
});

router.post('/courses/:courseId/module/create', (request, response) => {
    //todo(EG) create modules controller
    coursesController.createModule(request, response);
});

// loading courses, todo break out into separate controller
router.get('/courses/user/enrolled/:username', (request, response) => {
    coursesController.getUserEnrolledCourses(request, response);
});

router.get('/courses/user/admin/:username', (request, response) => {
    coursesController.getUserAdminCourses(request, response);
});
