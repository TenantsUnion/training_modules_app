import {LoggerInstance} from "winston";
import {NextFunction, Request, Response, Router} from "express";


export type RequestHandler<T> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

export abstract class AbstractRoutesController {
    constructor (protected logger: LoggerInstance) {
    }

    handle<T> (handler: RequestHandler<T>): RequestHandler<void> {
        return async (req, res, next) => {
            this.logger.info(`${handler.name}() ${req.method}-${req.originalUrl}`);
            try {
                let responsePayload = await handler.bind(this)(req, res, next);
                res.status(200).send(responsePayload);
            } catch (e) {
                this.logger.error(`Error handling request ${handler.name}`);
                this.logger.error(e);
                this.logger.error(e.stack);
                next(e);
            }
        };
    }

    abstract registerRoutes (router: Router);
}