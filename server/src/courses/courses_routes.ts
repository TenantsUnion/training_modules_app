import * as express from "express";
import {coursesController} from "../config/web_controller.config";
import {ModuleRoutes} from '../module/module_routes';
import {SectionRoutes} from '../section/section_routes';

let router = express.Router();

router.get('/user/:username/courses/admin/:courseTitle', (request, response) => {
    coursesController.loadAdminCourse(request, response);
});


router.post('/courses/create', (request, response) => {
    coursesController.createCourse(request, response);
});

router.post('/course/save/:courseId', (request, response) => {
   coursesController.saveCourse(request, response);
});

router.get('/courses/user/enrolled/:username', (request, response) => {
    coursesController.getUserEnrolledCourses(request, response);
});

router.get('/courses/user/admin/:username', (request, response) => {
    coursesController.getUserAdminCourses(request, response);
});

router.use(ModuleRoutes(coursesController));
router.use(SectionRoutes(coursesController));

export const CoursesRoutes = router;
