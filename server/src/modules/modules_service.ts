import {AdminModuleData, ModuleDetails} from "modules";

export const MODULES_LIST: AdminModuleData[] = [
    {
        id: "1",
        title: "repairs",
        active: true,
        lastEdited: "2017-07-20T12:00:00.0Z"
    }, {
        id: "2",
        title: "rent increases",
        active: false,
        lastEdited: "2017-07-22T08:30:00.0Z"
    }
];

export class ModulesService {
    getAdminModulesList(): AdminModuleData[] {
        return MODULES_LIST;
    }

    getAdminModuleDetails(): ModuleDetails {
        return null;
    }
}

export const modulesService = new ModulesService();
