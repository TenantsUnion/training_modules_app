import {AbstractWebController} from "./abstract_routes_controller";
import {Router, Request} from "express";
import {getLogger} from "../log";
import {CourseStructureViewQuery} from "@course/view/course_structure_view_query";
import {CourseViewQuery} from "@course/view/course_views_query";
import {ModuleViewQuery} from "@module/module_view_query";
import {SectionViewQuery} from "@section/admin/section_view_query";
import {UserCoursesListingViewQuery} from "../user/user_courses_listing_view_query";
import {UserProgressViewQuery} from "../user_progress/user_progress_view_query";
import {ViewsRequestParams, ViewsResponse} from "@shared/views";


export class ViewsRequestWebController extends AbstractWebController {
    query: {[key in keyof ViewsResponse]: (request: ViewsRequestParams) => Promise<ViewsResponse[key]>};

    constructor (private courseStructureViewQuery: CourseStructureViewQuery,
                 private courseTrainingViewQuery: CourseViewQuery,
                 private moduleTrainingViewQuery: ModuleViewQuery,
                 private sectionTrainingViewQuery: SectionViewQuery,
                 private coursesListingViewQuery: UserCoursesListingViewQuery,
                 private userProgressViewQuery: UserProgressViewQuery) {
        super(getLogger('ViewRequestController', 'info'));

        this.query = {
            courseStructure: ({courseId}) => this.courseStructureViewQuery.loadCourseStructure(courseId),
            courseTraining: ({courseId}) => this.courseTrainingViewQuery.loadCourseTraining(courseId),
            moduleTraining: ({moduleId}) => this.moduleTrainingViewQuery.loadModule(moduleId),
            sectionTraining: ({sectionId}) => this.sectionTrainingViewQuery.loadSection(sectionId),
            coursesListing: ({userId}) => this.coursesListingViewQuery.coursesListingView(userId),
            userProgress: ({userId, courseId}) => this.userProgressViewQuery.loadUserCourseProgress({userId, courseId})
        }
    }

    async handleViewRequest (req: Request): Promise<ViewsResponse> {
        let queryParams: ViewsRequestParams = req.query;
        let loadViewsAsync = Object.keys(queryParams).filter((key) => this.query[key])
            .map(async (viewRequest) => {
                let view = await this.query[viewRequest](queryParams);
                return {type: viewRequest, view}
            });
        return (await Promise.all(loadViewsAsync)).reduce((acc, {type, view}) => {
            acc[type] = view;
            return acc;
        }, <ViewsResponse> {});
    }

    registerRoutes (router: Router) {
        router.get('/views', this.handle(this.handleViewRequest));
    }

}