import * as express from "express";
import * as path from "path";
// var path = require('path');
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as config from "config";
import {users} from './routes/users';
import {Express} from 'express';
import {IErrorResponse} from '../../shared/http_responses';
import {LoginRoute} from './login/login_route';
import {AdminModulesRoute} from './admin/modules/modules_route';
/**
 * Configured to listen on port and started in /bin scripts
 */
var app: Express = express();

// view engine setup
app.set('views', path.join(__dirname, config.get('server.views_dir')));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


// error handler
app.use(function (err: IErrorResponse, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.use(express.static(path.join(__dirname, config.get('server.webapp_dir'))));
// serve home page
app.get('/', express.Router().get('/', function (req, res, next) {
    res.render('index', {
        query: req.query
    });
}));

app.use('/', LoginRoute);
app.use('/users', users);
app.use('/admin', AdminModulesRoute);

// has to go last so other routes can match, catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = {
        message: 'Not Found',
        status: 404
    };
    next(err);
});

//export as commonjs/node module since it will be loaded from start script
module.exports = app;
