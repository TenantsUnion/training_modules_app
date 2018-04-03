import {CoursesListingView, ViewCourseData, ViewCourseStructure} from "@shared/courses";
import {ViewModuleData} from "@shared/modules";
import {ViewSectionData} from "@shared/sections";
import {UserCourseProgressView} from "@shared/user_progress";
import {CourseEnrolledSummaryView, CourseEnrolledView, EnrolledUserView} from "@shared/course_progress_summary";

export interface LoadViewRequestParams {
    courseStructure?: boolean;
    courseTraining?: boolean;
    moduleTraining?: boolean;
    sectionTraining?: boolean;
    coursesListing?: boolean;
    userProgress?: boolean;
    courseProgressSummary?: boolean;
    userId?: string;
    moduleId?: string;
    courseId?: string;
    sectionId?: string;
}

export interface LoadViewResponse {
    courseStructure?: ViewCourseStructure;
    courseTraining?: ViewCourseData;
    moduleTraining?: ViewModuleData;
    sectionTraining?: ViewSectionData;
    coursesListing?: CoursesListingView;
    userProgress?: UserCourseProgressView;
    courseProgressSummary?: CourseEnrolledSummaryView;
    courseEnrolledUser?: CourseEnrolledView;
}

/**
 * Possible sql operations used to customize predicate value of {@link AbstractViewQuery#searchView} to filter
 * {@link Column} results
 */
export enum SqlOp {
    EQUALS = '=',
    NOT_EQUAL = '<>',
    GREATER = '>',
    LESS = '<',
    GREATER_OR_EQUAL = '>=',
    LESS_OR_EQUAL = '<=',
    BETWEEN = 'BETWEEN',
    LIKE = 'LIKE',
    IN = 'IN'
}

// top level predicates are AND'd together in sql
export type Predicate<Row = any> = {
    op: SqlOp,
    // OR'd together
    colNames: (keyof Row)[]
    val: any
};
export type OrderByCol<Row = any> = { colName: keyof Row, dir: 'asc' | 'desc' };

// might already be defined for vue table?
export type ViewSearchResponse<V extends object = object> = {
    links: object,
    data: V
};

export type ViewSearchQueryParams<Id = string, Row = object> = {
    q: ViewSearchParams<Id, Row>,
    queryType: string // corresponds to key to identify view query service to use
};

/**
 * Api configuration object for {@link AbstractViewQuery#searchView} query
 */
export type ViewSearchParams<Id = string, Row = object> = {
    predicates?: Predicate<Row>[],
    id?: Id
    orderBy?: OrderByCol<Row>[]
};

export enum SearchViewQueryType {
      COURSE_ENROLLED = 'course_enrolled'
}

export type SearchViewResponse = {
    [SearchViewQueryType.COURSE_ENROLLED]: EnrolledUserView[]
}


