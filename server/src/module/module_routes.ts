import * as express from "express";
import {RequestHandler} from 'express';

let router = express.Router();

export interface ModuleOperations {
    createModule: RequestHandler;
    saveModule: RequestHandler;
}

export const ModuleRoutes = (moduleCtrl:ModuleOperations) =>{
    router.post('/course/:courseId/module/save', moduleCtrl.saveModule);
    router.post('/course/:courseId/module/create', moduleCtrl.createModule);
    return router;
};