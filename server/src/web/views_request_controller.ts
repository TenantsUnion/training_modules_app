import {AbstractWebController} from "./abstract_routes_controller";
import {Router, Request} from "express";
import {
    SearchViewQueryType,
    ViewSearchQueryParams,
    LoadViewRequestParams,
    LoadViewResponse,
    SearchViewResponse, ViewSearchResponse, ViewSearchParams
} from "@shared/views";
import {CourseStructureViewQuery} from "@server/views/course/course_structure_view_query";
import {CourseTrainingViewQuery} from "@server/views/training/course_views_query";
import {ModuleViewQuery} from "@server/views/training/module_training_view_query";
import {SectionViewQuery} from "@server/views/training/section_view_query";
import {UserCoursesListingViewQuery} from "@server/views/user/user_courses_listing_view_query";
import {UserProgressViewQuery} from "@server/views/user_progress/user_progress_view_query";
import {CourseEnrolledSummaryViewQuery} from "@server/views/course/course_enrolled_summary_view_query";
import {getLogger} from "@server/log";
import {CourseEnrolledUserViewQuery} from "@v-user_progress/course_enrolled_user_view_query";


export class ViewsRequestWebController extends AbstractWebController {
    loadViewQuery: {[key in keyof LoadViewResponse]: (request: LoadViewRequestParams) => Promise<LoadViewResponse[key]>};
    searchViewQuery: {[key in SearchViewQueryType]: (request: ViewSearchParams) => Promise<SearchViewResponse[key]>};

    constructor(private courseStructureViewQuery: CourseStructureViewQuery,
                private courseTrainingViewQuery: CourseTrainingViewQuery,
                private moduleTrainingViewQuery: ModuleViewQuery,
                private sectionTrainingViewQuery: SectionViewQuery,
                private coursesListingViewQuery: UserCoursesListingViewQuery,
                private userProgressViewQuery: UserProgressViewQuery,
                private courseEnrolledSummaryViewQuery: CourseEnrolledSummaryViewQuery,
                private courseEnrolledUserViewQuery: CourseEnrolledUserViewQuery) {
        super(getLogger('ViewRequestController', 'info'));

        this.loadViewQuery = {
            courseStructure: ({courseId}) => courseStructureViewQuery.searchView({id: courseId}),
            courseTraining: ({courseId}) => courseTrainingViewQuery.loadCourseTraining(courseId),
            moduleTraining: ({moduleId}) => moduleTrainingViewQuery.loadModule(moduleId),
            sectionTraining: ({sectionId}) => sectionTrainingViewQuery.loadSection(sectionId),
            coursesListing: ({userId}) => coursesListingViewQuery.coursesListingView(userId),
            userProgress: ({userId, courseId}) => userProgressViewQuery.loadUserCourseProgress({userId, courseId}),
            courseProgressSummary: ({courseId}) => courseEnrolledSummaryViewQuery.searchView({id: courseId})
        };

        this.searchViewQuery = {
            course_enrolled: (q: ViewSearchParams) => {
                return courseEnrolledUserViewQuery.searchView(q)
            }
        };
    }

    /**
     * Handles requesting to load multiple view types by identifying a view query type and corresponding id
     * @param {e.Request} req
     * @returns {Promise<LoadViewResponse>}
     */
    async handleViewRequest(req: Request): Promise<LoadViewResponse> {
        let queryParams: LoadViewRequestParams = req.query;
        let loadViewsAsync = Object.keys(queryParams).filter((key) => this.loadViewQuery[key])
            .map(async (viewRequest) => {
                let view = await this.loadViewQuery[viewRequest](queryParams);
                return {type: viewRequest, view}
            });
        return (await Promise.all(loadViewsAsync)).reduce((acc, {type, view}) => {
            acc[type] = view;
            return acc;
        }, <LoadViewResponse> {});
    }

    /**
     * Handles search a single view type according to the query properties of the 'q' {@link ViewSearchQueryParams} query parameter
     * @param {e.Request} req
     * @returns {Promise<void>}
     */
    async handleSearchViewRequest(req: Request): Promise<ViewSearchResponse> {
        let {queryType, q}: ViewSearchQueryParams = req.query;
        console.log("q:");
        console.log(q);
        const query = this.searchViewQuery[queryType];
        const data = await query(JSON.parse(<string>q));
        return {
            data: data,
            links: {}
        }
    }

    registerRoutes(router: Router) {
        router.get('/views', this.handle(this.handleViewRequest));
        router.get('/views/search', this.handle(this.handleSearchViewRequest));
    }

}