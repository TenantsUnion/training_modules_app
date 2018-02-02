import {Datasource} from '../../datasource';
import {ViewModuleData} from '@shared/modules';

export class ModuleViewQuery {
    constructor(private datasource: Datasource) {
    }

    loadModule(id: string): ViewModuleData {
        return null;
    }
}