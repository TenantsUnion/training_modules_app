import {Datasource} from "../datasource";
import {AbstractRepository} from "../repository";
import {TrainingProgressUpdate} from "@shared/user_progress";


export abstract class TrainingProgressRepository extends AbstractRepository {
    constructor (sqlTemplate: Datasource) {
        super('', sqlTemplate);
    }

    saveTrainingProgress (trainingProgress: TrainingProgressUpdate) {
        this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              UPDATE tu.course_progress SET
                correct_question_ids   = $1 || correct_question_ids,
                viewed_content_ids     = $2 || viewed_content_ids,
                submitted_question_ids = $3 || submitted_question_ids
                where user_id = $4 and 
            `,
            values: []
        })
    }

    abstract tableName (): string;
}
