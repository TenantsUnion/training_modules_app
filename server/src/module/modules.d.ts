import {CreateModuleData} from "modules";

declare namespace modules {
    interface CreateModuleDataHeaderId extends CreateModuleData {
        headerContentId: string;
    }
}

export = modules;