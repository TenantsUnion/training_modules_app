import {AbstractWebController} from "./abstract_routes_controller";
import {Router} from "express";
import {
    CoursesListingView, ViewCourseData, ViewCourseStructure
} from "@shared/courses";
import {ViewModuleData} from "@shared/modules";
import {ViewSectionData} from "@shared/sections";
import {getLogger} from "../log";
import {CourseStructureViewQuery} from "@course/view/course_structure_view_query";
import {CourseViewQuery} from "@course/view/course_views_query";
import {ModuleViewQuery} from "@module/module_view_query";
import {SectionViewQuery} from "@section/admin/section_view_query";
import {UserCoursesListingViewQuery} from "../user/user_courses_listing_view_query";

export interface ViewRequestParams {
    courseStructure: boolean;
    courseTraining: boolean;
    moduleTraining: boolean;
    sectionTraining: boolean;
    enrolledCourses: boolean;
    adminCourses: boolean;
    userProgress: boolean;
    userId: string;
    moduleId: string;
    courseId: string;
    sectionId: string;
}

export interface ViewRequestResponse {
    courseStructure: ViewCourseStructure;
    courseTraining: ViewCourseData;
    moduleTraining: ViewModuleData;
    sectionTraining: ViewSectionData;
    coursesListing: CoursesListingView;
}

export class ViewRequestController extends AbstractWebController {
    query: {[key in keyof ViewRequestResponse]: (request: ViewRequestParams) => Promise<ViewRequestResponse[key]>};

    constructor (private courseStructureViewQuery: CourseStructureViewQuery,
                 private courseTrainingViewQuery: CourseViewQuery,
                 private moduleTrainingViewQuery: ModuleViewQuery,
                 private sectionTrainingViewQuery: SectionViewQuery,
                 private coursesListingViewQuery: UserCoursesListingViewQuery) {
        super(getLogger('ViewRequestController', 'info'));

        this.query = {
            courseStructure: ({courseId}) => this.courseStructureViewQuery.loadCourseStructure(courseId),
            courseTraining: ({courseId}) => this.courseTrainingViewQuery.loadCourseTraining(courseId),
            moduleTraining: ({moduleId}) => this.moduleTrainingViewQuery.loadModule(moduleId),
            sectionTraining: ({sectionId}) => this.sectionTrainingViewQuery.loadSection(sectionId),
            coursesListing: ({userId}) => this.coursesListingViewQuery.coursesListingView(userId),
        }
    }

    async handleViewRequest (req): Promise<ViewRequestResponse> {
        return null;
    }

    registerRoutes (router: Router) {
        this.handle(this.handleViewRequest)
    }

}