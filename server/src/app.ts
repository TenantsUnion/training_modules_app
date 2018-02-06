import express from "express";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {config} from "@shared/normalize_imports";
import session from "express-session";
import {HttpResponse} from '@shared/http_responses';
import {AccountRoutes} from "./account/account_routes";
import {UserContentRoutes} from "./content/content_routes";
import {CoursesRoutes} from "./courses/courses_routes";
import {QuillRoutes} from './training_entity/quill/quill_routes_controller';
import {getLogger, LOG_LEVELS} from './log';
import {Express} from 'express';
import {AvailableCourseRoutes} from "./available_courses/available_courses_routes";

/**
 * Configured to listen on port and started in /bin scripts
 */
let app:Express = express();

// view engine setup
app.set('views', path.join(__dirname, config.get('server.views_dir')));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.use(express.static(path.join(__dirname, config.get('server.webapp_dir'))));

const httpLogger = getLogger('HttpServer', LOG_LEVELS.debug);
app.use((req, res, next) => {
    httpLogger.log('trace', `${req.body}`);
    next();
});
// serve home page
app.get('/', express.Router().get('/', function (req, res, next) {
    res.render('index', {
        query: req.query
    });
}));

app.use(AccountRoutes);
app.use(UserContentRoutes);
app.use(CoursesRoutes);
app.use(QuillRoutes);
app.use(AvailableCourseRoutes);

// has to go last so other routes can match, catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = {
        message: 'Not Found',
        status: 404
    };
    next(err);
});

export {app as app};
