import {AbstractRoutesController} from "./abstract_routes_controller";
import {UserEnrolledCourseData} from "@shared/courses";
import {getLogger} from "../log";
import {Router} from "express";

const express = require('express');

export class UserProgressWebController extends AbstractRoutesController {


    constructor () {
        super(getLogger('UserProgressWebController', 'info'));
    }

    async enrollInCourse (req, res, next): Promise<UserEnrolledCourseData> {
        this.logger.info('You called me!!');
        return null;
    }

    registerRoutes (router: Router): Router {
        return router
            .post('/user/course/enroll', this.handle(this.enrollInCourse));
    }
}