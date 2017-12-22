import * as express from "express";
import {RequestHandler} from 'express';


export interface ModuleOperations {
    createModule: RequestHandler;
    saveModule: RequestHandler;
    createSection: RequestHandler;
}

export const ModuleRoutes = (moduleCtrl: ModuleOperations) => {
    let router = express.Router();
    router.post('/course/:courseId/module/:moduleId/save', (request, response, next) => {
        moduleCtrl.saveModule(request, response, next);
    });
    router.post('/course/:courseId/module/create', (request, response, next) => {
        moduleCtrl.createModule(request, response, next);
    });

    router.post('/course/:courseId/module/:moduleId/section/create', (request, response, next) => {
        moduleCtrl.createSection(request, response, next);
    });

    return router
};