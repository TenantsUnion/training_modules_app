import {HttpResponse} from '@shared/http_responses';
import {AccountRoutes} from "@server/web/account_routes";
import {getLogger, LOG_LEVELS} from './log';
import {Express} from 'express';
import {AvailableCourseRoutes} from "@server/web/available_courses_routes";
import {
    coursesController,
    userProgressWebController, userWebController,
    viewsRequestWebController
} from "@server/web/web_controller_config";
import {QuillRoutes} from "@server/handlers/training/quill/quill_routes_controller";

const config = require("config");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const initApp = (): Express => {
    /**
     * Configured to listen on port and started in /bin scripts
     */
    let app: Express = express();

    app.use(logger('dev'));
    app.use(bodyParser.json({
        limit: '10mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(session({
        secret: config.get('express.secret'),
        saveUninitialized: false,
        resave: true,
        cookie: {
            expires: false
        }
    }));


// error handler
    app.use(function (err: HttpResponse, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
    });

    app.use(express.static(config.get('webapp.dist')));

    const httpLogger = getLogger('HttpServer', LOG_LEVELS.debug);
    app.use((req, res, next) => {
        httpLogger.log('trace', `${req.body}`);
        next();
    });

    app.use(AccountRoutes);
    app.use(QuillRoutes);
    app.use(AvailableCourseRoutes);
    userProgressWebController.registerRoutes(app);
    userWebController.registerRoutes(app);
    viewsRequestWebController.registerRoutes(app);
    coursesController.registerRoutes(app);

// has to go last so other routes can match, catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = {
            message: 'Not Found',
            status: 404
        };
        next(err);
    });

    return app;
};

module.exports = initApp;
