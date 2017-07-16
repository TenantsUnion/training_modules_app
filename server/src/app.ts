import * as express from "express";
import * as path from "path";
var index  = require('./routes/index');
import {users} from './routes/users';
// var path = require('path');
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";


/**
 * Configured to listen on port and started in /bin scripts
 */
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'webapp/views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'webapp/dist')));

app.use('/', index);
app.use('/users', users);


interface IErrorResponse {
    status: number,
    message: string
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = {
      message: 'Not Found',
      status: 404
  };
  next(err);
});

// error handler
app.use(function(err:IErrorResponse, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
