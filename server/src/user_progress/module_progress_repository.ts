import {Datasource} from "../datasource";
import {TrainingProgressRepository} from "./training_progress_repository";

export class ModuleProgressRepository extends TrainingProgressRepository {
    constructor (sqlTemplate: Datasource) {
        super(sqlTemplate)
    }

    table () {
        return 'module_progress';
    }
}