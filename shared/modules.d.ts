declare namespace modules {

    interface IModuleInfo {
        id: string;
        name: string;
        lastEdited: string;
    }

    interface IAdminModuleInfo extends IModuleInfo {
        visible: boolean;
    }

    interface IAdminModuleDetails extends IAdminModuleInfo {
        sections: ISection[];
    }

    interface ISection {

    }
}

export = modules;