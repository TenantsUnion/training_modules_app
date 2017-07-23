import {IAdminModuleInfo} from "modules";

export const MODULES_LIST: IAdminModuleInfo[] = [
    {
        id: "1",
        name: "repairs",
        visible: true,
        lastEdited: "2017-07-20T12:00:00.0Z"
    }, {
        id: "2",
        name: "rent increases",
        visible: false,
        lastEdited: "2017-07-22T08:30:00.0Z"
    }
];

export class ModulesService {
    getAdminModulesList(): IAdminModuleInfo[] {
        return MODULES_LIST;
    }

    getAdminModuleDetails(): IAdminModuleDetails {
        return
    }
}

export const modulesService = new ModulesService();
