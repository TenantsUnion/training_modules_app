import axios from "axios";
import {IAdminModuleInfo} from "modules";

class ModulesHttpService {

    getModules(): Promise<IAdminModuleInfo[]> {
        return axios.get('admin/modules').then((response) => {
            return <IAdminModuleInfo[]> response.data;
        }).catch((error) => {
            return error;
        });
    }
}

export interface IModulesHttpService {
}

export const modulesHttpService = new ModulesHttpService();
