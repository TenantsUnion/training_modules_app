import {CourseProgressId, UserCourseProgressView, UserModuleProgressView} from "@shared/user_progress";
import {Datasource} from "@server/datasource";

export interface TrainingEntityProgressDbRow {
    userId: string;
    completedQuestionIds: { [questionId: string]: string };
    submittedQuestionIds: { [questionId: string]: string };
    viewedContentIds: { [contentId: string]: string }
    createdAt: string;
    id: string;
    lastModifiedAt: string;
    lastViewedAt: string;
    version: number;
    questionsCompleted: string,
    contentViewed: string

}

export type UserModuleProgressDbRow = TrainingEntityProgressDbRow & {
    sections: TrainingEntityProgressDbRow[];
    moduleCompleted: string;
};

export type UserCourseProgressDbRow = TrainingEntityProgressDbRow & {
    modules: UserModuleProgressDbRow[];
    courseCompleted: string;
}


type mapRow<R, V> = (row: R) => V;
type processView<V> = (view: V) => V;

export const mapUserProgressView: mapRow<UserCourseProgressDbRow, UserCourseProgressView> = (userProgressRow) => {
    let {modules, ...courseView} = userProgressRow;
    return {
        ...courseView,
        modules: !modules ? {} :
            modules
                .map((module: UserModuleProgressDbRow): UserModuleProgressView => {
                    let {userId, sections, ...moduleView} = module;
                    return {
                        ...moduleView,
                        sections: !sections ? {} : sections
                            .map((section: TrainingEntityProgressDbRow) => {
                                let {userId, ...sectionView} = section;
                                return sectionView;
                            })
                            .reduce((acc, section) => {
                                acc[section.id] = section;
                                return acc;
                            }, {})
                    };
                })
                .reduce((acc, module) => {
                    acc[module.id] = module;
                    return acc;
                }, {})
    }
};

export class UserProgressViewQuery {
    constructor (protected datasource: Datasource) {
    }

    async loadUserCourseProgress ({userId, courseId}: CourseProgressId): Promise<UserCourseProgressView> {
        return mapUserProgressView(await this.loadEnrolledUserCourseProgress(userId, courseId));
    }

    private async loadEnrolledUserCourseProgress (userId, courseId): Promise<UserCourseProgressDbRow> {
        return (await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT cp.*, m.modules FROM tu.course c
                INNER JOIN tu.course_progress cp ON c.id = cp.id
                LEFT JOIN LATERAL
                          (
                          SELECT json_agg(m.*) AS modules FROM
                            (
                              SELECT mp.*, s.sections FROM tu.module m
                                INNER JOIN tu.module_progress mp ON m.id = mp.id
                                LEFT JOIN LATERAL
                                          (
                                          SELECT json_agg(s.*) AS sections FROM
                                            (
                                              SELECT sp.* FROM tu.section s
                                                INNER JOIN tu.section_progress sp ON s.id = sp.id WHERE
                                                s.id = ANY (m.ordered_section_ids) AND sp.user_id = $1
                                            ) s
                                          ) s ON TRUE
                              WHERE m.id = ANY (c.ordered_module_ids) AND mp.user_id = $1
                            ) m
                          ) m ON TRUE
              WHERE c.id = $2 AND cp.user_id = $1;
            `,
            values: [userId, courseId]
        }))[0];
    }
}