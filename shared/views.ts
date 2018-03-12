import {CoursesListingView, ViewCourseData, ViewCourseStructure} from "@shared/courses";
import {ViewModuleData} from "@shared/modules";
import {ViewSectionData} from "@shared/sections";
import {UserCourseProgressView} from "@shared/user_progress";

export interface ViewsRequestParams {
    courseStructure?: boolean;
    courseTraining?: boolean;
    moduleTraining?: boolean;
    sectionTraining?: boolean;
    coursesListing?: boolean;
    userProgress?: boolean;
    userId?: string;
    moduleId?: string;
    courseId?: string;
    sectionId?: string;
}

export interface ViewsResponse {
    courseStructure?: ViewCourseStructure;
    courseTraining?: ViewCourseData;
    moduleTraining?: ViewModuleData;
    sectionTraining?: ViewSectionData;
    coursesListing?: CoursesListingView;
    userProgress?: UserCourseProgressView;
}