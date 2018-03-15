import {Datasource} from "../datasource";
import {orderObjByIds, toIdObjMap} from "@util/id_entity";
import {CourseProgressId, UserCourseProgressView, UserModuleProgressView} from "@shared/user_progress";

export interface TrainingEntityProgressDbRow {
    userId: string;
    active: true;
    submitIndividually: false;
    correctQuestionsIds: string[];
    createdAt: string;
    description: string;
    headerDataId: string;
    id: string;
    lastModifiedAt: string;
    lastViewedAt: string;
    orderedContentIds: string[];
    orderedContentQuestionIds: string[];
    orderedQuestionIds: string[];
    submittedQuestionsIds: string[];
    timeEstimate: number;
    title: string;
    version: number;
    viewedContentIds: string[]

}

export type UserSectionProgressDbRow = TrainingEntityProgressDbRow & {
    sectionId: string;
};

export type UserModuleProgressDbRow = TrainingEntityProgressDbRow & {
    moduleId: string;
    orderedSectionIds: string[];
    sections: UserSectionProgressDbRow[];
};

export type UserCourseProgressDbRow = TrainingEntityProgressDbRow & {
    courseId: string;
    openEnrollment: boolean;
    orderedModuleIds: string[];
    modules: UserModuleProgressDbRow[];
}


type mapRow<R, V> = (row: R) => V;
type processView<V> = (view: V) => V;

const mapUserProgressView: mapRow<UserCourseProgressDbRow, UserCourseProgressView> = (userProgressRow) => {
    let {courseId, modules, ...courseView} = userProgressRow;
    return {
        ...courseView,
        modules: modules ? modules.map((module: UserModuleProgressDbRow): UserModuleProgressView => {
            let {userId, moduleId, sections, ...moduleView} = module;
            return {
                ...moduleView,
                sections: sections ? sections.map((section: UserSectionProgressDbRow) => {
                    let {sectionId, userId, ...sectionView} = section;
                    return sectionView;
                }) : []
            };
        }) : []
    }
};

export class UserProgressViewQuery {
    constructor (protected datasource: Datasource) {
    }

    async loadUserCourseProgress ({userId, courseId}: CourseProgressId): Promise<UserCourseProgressView> {
        let {modules: unorderedModules, ...courseProps} =
            mapUserProgressView(await this.loadEnrolledUserCourseProgress(userId, courseId));
        let modules = unorderedModules ? orderObjByIds(courseProps.orderedModuleIds, toIdObjMap(unorderedModules))
            .map((module: UserModuleProgressView) => {
                let {sections: unorderedSections, ...moduleProps} = module;
                let sections = unorderedSections ? orderObjByIds(moduleProps.orderedSectionIds, toIdObjMap(unorderedSections)) : [];
                return {...moduleProps, sections};
            }) : [];
        return {...courseProps, modules};
    }

    private async loadEnrolledUserCourseProgress (userId, courseId): Promise<UserCourseProgressDbRow> {
        return (await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.time_estimate, c.title, c.description, c.active, c.ordered_module_ids,
                c.ordered_question_ids, c.submit_individually, c.ordered_content_ids, c.ordered_content_question_ids,
                cp.*, m.modules FROM
                tu.course c
                INNER JOIN tu.course_progress cp ON c.id = cp.id
                INNER JOIN LATERAL
                           (
                           SELECT json_agg(m.*) AS modules FROM
                             (
                               SELECT m.id, m.title, m.description, m.ordered_section_ids, m.ordered_content_ids,
                                 m.time_estimate, m.submit_individually, m.active, m.ordered_question_ids,
                                 m.ordered_content_question_ids, mp.*, s.sections FROM
                                 tu.module m
                                 INNER JOIN tu.module_progress mp
                                   ON m.id = mp.id
                                 INNER JOIN LATERAL
                                            (
                                            SELECT json_agg(s.*) AS sections FROM
                                              (
                                                SELECT s.id, s.title, s.description, s.ordered_content_ids, s.active,
                                                  s.submit_individually, s.ordered_question_ids, s.time_estimate,
                                                  s.ordered_content_question_ids, sp.* FROM
                                                  tu.section s INNER JOIN tu.section_progress sp
                                                    ON s.id = sp.id WHERE
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