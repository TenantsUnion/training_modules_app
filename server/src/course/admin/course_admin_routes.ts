import * as express from "express";
import {coursesController} from "../../config/web_controller_config";
import {SectionRoutes} from '@section/admin/section_routes';
import {ModuleRoutes} from "@module/admin/admin_module_routes";

let router = express.Router();
// todo write http entity for deleting a course

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

router.get('/courses/user/enrolled/:userId', (request, response) => {
    coursesController.getUserEnrolledCourses(request, response);
});

router.get('/courses/user/admin/:userId', (request, response) => {
    coursesController.getUserAdminCourses(request, response);
});

router.use(ModuleRoutes(coursesController));
router.use(SectionRoutes(coursesController));

export const CoursesRoutes = router;
