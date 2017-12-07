import http from 'http';
import Debug from 'debug';
import config from 'config'

import {getLogger} from './script_logger';
import {app} from '../server/dist/server/src/app';
import {initSocket} from '../server/dist/server/src/socket';

const logger = getLogger('start_server');
const debug = Debug('myapp:server');

logger.info('start script');


export const run = async () => {
    const port = config.get("server.port");
    app.set('port', port);

        logger.info('inside run');

        /**
         * Create HTTP server.
         */
        var server = http.createServer(app);
        server.listen(port);
        /**
         * Event listener for HTTP server "error" event. Default error handling for http server
         */
        server.on('error', function onError(error) {
                if (error.syscall !== 'listen') {
                    throw error;
                }

                var bind = typeof port === 'string'
                    ? 'Pipe ' + port
                    : 'Port ' + port;

                // handle specific listen errors with friendly messages
                switch (error.code) {
                    case 'EACCES':
                        console.error(bind + ' requires elevated privileges');
                        process.exit(1);
                        break;
                    case 'EADDRINUSE':
                        console.error(bind + ' is already in use');
                        process.exit(1);
                        break;
                    default:
                        throw error;
                }
            }
        );

        /**
         * Event listener for HTTP server "listening" event. Default listening handler
         */
        server.on('listening', function onListening() {
                var addr = server.address();
                var bind = typeof addr === 'string'
                    ? 'pipe ' + addr
                    : 'port ' + addr.port;
                debug('Listening on ' + bind);
            }
        );

        /**
         * Initialize socket.io server
         */
        initSocket(server);
};
