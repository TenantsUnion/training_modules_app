import {AbstractRepository, getUTCNow} from "../../repository";
import {Datasource} from "../../datasource";

export class CourseProgressRepository extends AbstractRepository {
    constructor (sqlTemplate: Datasource) {
        super('', sqlTemplate);
    }

    async createCourseProgress ({courseId, userId}: { courseId: string; userId: string }) {
        let time = getUTCNow();
        await this.sqlTemplate.query({
            text: `
              INSERT INTO tu.course_progress (user_id, course_id, last_view_at, last_modified_at, created_at)
                VALUES  ($1, $2, $3, $3, $3)`,
            values: [courseId, userId, time]
        });
    }
}