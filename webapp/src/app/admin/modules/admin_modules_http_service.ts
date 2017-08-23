import axios from "axios";
import {AdminModuleData} from "modules";

class ModulesHttpService {

    getModules(): Promise<AdminModuleData[]> {
        return axios.get('admin/modules').then((response) => {
            return <AdminModuleData[]> response.data;
        }).catch((error) => {
            return error;
        });
    }
}

export interface IModulesHttpService {
}

export const modulesHttpService = new ModulesHttpService();
