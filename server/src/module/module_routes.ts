import * as express from "express";
import {RequestHandler} from 'express';


export interface ModuleOperations {
    createModule: RequestHandler;
    saveModule: RequestHandler;
}

export const ModuleRoutes = (moduleCtrl: ModuleOperations) => {
    let router = express.Router();
    router.post('/course/:courseId/module/save', (request, response, next) => {
        moduleCtrl.saveModule(request, response, next);
    });
    router.post('/course/:courseId/module/create', (request, response, next) => {
        moduleCtrl.createModule(request, response, next);
    });
    return router;
};