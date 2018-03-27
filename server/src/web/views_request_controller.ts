import {AbstractWebController} from "./abstract_routes_controller";
import {Router, Request} from "express";
import {ViewsRequestParams, ViewsResponse} from "@shared/views";
import {CourseStructureViewQuery} from "@server/views/course/course_structure_view_query";
import {CourseTrainingViewQuery} from "@server/views/training/course_views_query";
import {ModuleViewQuery} from "@server/views/training/module_training_view_query";
import {SectionViewQuery} from "@server/views/training/section_view_query";
import {UserCoursesListingViewQuery} from "@server/views/user/user_courses_listing_view_query";
import {UserProgressViewQuery} from "@server/views/user_progress/user_progress_view_query";
import {CourseEnrolledSummaryViewQuery} from "@server/views/course/course_enrolled_summary_view_query";
import {getLogger} from "@server/log";


export class ViewsRequestWebController extends AbstractWebController {
    query: {[key in keyof ViewsResponse]: (request: ViewsRequestParams) => Promise<ViewsResponse[key]>};

    constructor (private courseStructureViewQuery: CourseStructureViewQuery,
                 private courseTrainingViewQuery: CourseTrainingViewQuery,
                 private moduleTrainingViewQuery: ModuleViewQuery,
                 private sectionTrainingViewQuery: SectionViewQuery,
                 private coursesListingViewQuery: UserCoursesListingViewQuery,
                 private userProgressViewQuery: UserProgressViewQuery,
                 private courseEnrolledSummary: CourseEnrolledSummaryViewQuery) {
        super(getLogger('ViewRequestController', 'info'));

        this.query = {
            courseStructure: ({courseId}) => this.courseStructureViewQuery.searchView({id: courseId}),
            courseTraining: ({courseId}) => this.courseTrainingViewQuery.loadCourseTraining(courseId),
            moduleTraining: ({moduleId}) => this.moduleTrainingViewQuery.loadModule(moduleId),
            sectionTraining: ({sectionId}) => this.sectionTrainingViewQuery.loadSection(sectionId),
            coursesListing: ({userId}) => this.coursesListingViewQuery.coursesListingView(userId),
            userProgress: ({userId, courseId}) => this.userProgressViewQuery.loadUserCourseProgress({userId, courseId}),
            courseProgressSummary: ({courseId}) => this.courseEnrolledSummary.searchView({id: courseId})
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