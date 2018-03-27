import {Request, Response, Router} from 'express';
import {availableCoursesViewQuery} from "@server/views/view_query_config";
import {getLogger} from "../log";
import {CourseDescription} from "@shared/courses";
import {loggedInUserId} from "./account_web_controller";

let router = Router();
let logger = getLogger('AvailableCoursesRoutes');
let logError = (e, request: Request, response: Response) => {
    const message = `Error executing ${request.originalUrl}.\n${e}\n${JSON.stringify(e.stack, null, 2)}`;
    logger.error(message);
    response.status(500).send(message);
};
router.get('/available-courses/list', async (request: Request, response: Response) => {
    try {
        let userId = loggedInUserId(request);
        let results: CourseDescription[] = userId ?
            await availableCoursesViewQuery.enrollableCourses(userId) :
            await availableCoursesViewQuery.availableCoursesList();
        response.status(200).send(results);
    } catch (e) {
        logError(e, request, response);
    }
});

export const AvailableCourseRoutes = router;
