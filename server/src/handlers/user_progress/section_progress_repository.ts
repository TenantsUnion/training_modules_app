import {Datasource} from "../../datasource";
import {TrainingProgressRepository} from "./training_progress_repository";

export class SectionProgressRepository extends TrainingProgressRepository {
    constructor (sqlTemplate: Datasource) {
        super(sqlTemplate)
    }

    get tableNames () {
       return {
           progress: 'section_progress',
           training: 'section'
       }
    }
}

