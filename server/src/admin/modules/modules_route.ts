import {Request, Response, Router} from 'express';
import * as express from 'express';
import {modulesService} from "../../modules/modules_service";

export class ModulesController {
    getModules(request: Request, response: Response) {
        response.status(200);
        response.send(modulesService.getAdminModulesList());
    }

    getModuleDetails(request:Request, response: Response) {
        response.status(200);
        response.send(modulesService.getAdminModulesList());
    }

}

let moduleController = new ModulesController();
let router: Router = express.Router();

router.get('/modules', moduleController.getModules);

export const AdminModulesRoute = router;
