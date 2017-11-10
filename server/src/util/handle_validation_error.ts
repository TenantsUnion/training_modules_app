import {LoggerInstance} from 'winston';
import {Request, Response} from 'express';

/**
 * Returns a function that logs error messages and sends a '422' http error response with the provided error messages object
 * @param {winston.LoggerInstance} logger - logger instance to use for validation error message logging
 * @returns {(errMsgs, req, res){}} - a function that logs and sends an errorMsgs object with an '422' http error response
 */
export const logHandleValidationError: (logger: LoggerInstance) => (errMsgs: { [index: string]: string }, req: Request, res: Response) => void =
    (logger: LoggerInstance) => {
        if (!logger) {
            throw new Error('logger parameter required');
        }
        return (errMsgs, req, res) => {
            // assume session.user_id exists since request should be intercepted before validation if the user is not logged in
            logger.error(`422 Validation error for user: ${req.session.user_id} path: ${req.path} messages: ${errMsgs}`);
            res.status(422).send(errMsgs);
        };
    };

/**
 * Returns a function that logs error messages and sends a '500' http error response with the provided exception object
 * @param {winston.LoggerInstance} logger - logger instance to use for validation error message logging
 * @returns {(ex, req, res){}} - a function that logs and sends an errorMsgs object with an '500' http error response
 */
export const logHandleServerError: (logger: LoggerInstance) => (e: any, req: Request, Response: Response) => void =
    (logger: LoggerInstance) => {
        if (!logger) {
            throw new Error('logger parameter required');
        }
        return (ex, req, res) => {
            logger.error(`500 Application exception for user: ${req.session.user_id} path: ${req.path}`);
            logger.error(`Exception: ${ex}\n${ex.stack}`);
            res.status(500).send(ex);
        };
    };
