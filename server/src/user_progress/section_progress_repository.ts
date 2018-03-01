import {Datasource} from "../datasource";
import {TrainingProgressRepository} from "./training_progress_repository";

export class SectionProgressRepository extends TrainingProgressRepository {
    constructor (sqlTemplate: Datasource) {
        super(sqlTemplate)
    }

    table () {
        return 'section_progress';
    }
}
