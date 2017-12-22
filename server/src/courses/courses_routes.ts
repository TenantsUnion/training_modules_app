import * as express from "express";
import {coursesController} from "../config/web_controller_config";
import {ModuleRoutes} from './module/module_routes';
import {SectionRoutes} from './section/section_routes';

let router = express.Router();
//http://localhost:8080/user/1/admin/course/course-1
// todo delete
router.get('/user/:userId/admin/course/:courseSlug', (request, response) => {
    coursesController.loadUserAdminCourseWebView(request, response);
});

router.get('/view/course/admin/:courseId', (request, response) => {
    coursesController.loadUserAdminCourseWebView(request, response);
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
