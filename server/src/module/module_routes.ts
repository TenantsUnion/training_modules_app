import * as express from "express";
import {RequestHandler} from 'express';


export interface ModuleOperations {
    createModule: RequestHandler;
    saveModule: RequestHandler;
    createSection: RequestHandler;
    loadModule: RequestHandler;
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

    // router.get('/view/course/admin/:courseId', (request, response) => {
    //     coursesController.loadUserAdminCourseWebView(request, response);
    // });

    router.get('/view/module/admin/:moduleId', (request, response, next) => {
        moduleCtrl.loadModule(request, response, next);
    });

    return router
};