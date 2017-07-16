var winston = require('winston');
var _ = require('underscore');

var logLevel = 'info';

var customColors = {
    trace: 'white',
    debug: 'green',
    info: 'blue',
    warn: 'yellow',
    crit: 'red',
    fatal: 'red'
};

var basicTransportOptions = {
    colorize: true,
    timestamp: true,
    prettyPrint: true,
    showLevel: true
};

var rolloverFileOptions = _.extend(basicTransportOptions, {

    //todo  filename?
    maxsize: 1024 * 1024 * 1024,
    maxFiles: 5,
    zippedArchive: true,
    rotationFormat: 'gz'
});

var env = process.env.ENV;

//extend transport options
// var jsonTransportOptions = process.env.ENV ? {
//
//
// };

var loggers = {};

logger.getTransport = function(name){
   var namedLogger = new winston.Logger({
       colors:customColors,
       level: logLevel,
       levels: {
           fatal: 0,
           crit: 1,
           warn: 2,
           info: 3,
           debug: 4,
           trace: 5
       },
       transports: [
           process.env.Env
       ]
   });
};

var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            colorize: true,
            timestamp: true
        })

    ]

});