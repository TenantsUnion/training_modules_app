import axios from "axios";
import {CreateModuleData} from "modules";

export class ModulesService {

    createModule (createModuleData:CreateModuleData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(`course/${createModuleData.courseId}/module/create`)
        });
    }
}

export const modulesService = new ModulesService();