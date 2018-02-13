import * as express from "express";
import {RequestHandler} from 'express';

export interface SectionOperations {
    saveSection: RequestHandler;
    loadSection: RequestHandler;
}

export const SectionRoutes = (sectionCtrl: SectionOperations) => {
    let router = express.Router();
    router.post('/course/:courseId/module/:moduleId/section/:sectionId/save', (request, response, next) => {
        sectionCtrl.saveSection(request, response, next);
    });

    router.get('/view/section/admin/:sectionId', (request, response, next) => {
        sectionCtrl.loadSection(request, response, next);
    });

    return router;
};