import {LoggerInstance} from "winston";
import {NextFunction, Request, Response, Router} from "express";


export type RequestHandler<T> = (req: Request) => Promise<T>;

export abstract class AbstractWebController {
    constructor (protected logger: LoggerInstance) {
    }

    handle<T> (handler: RequestHandler<T>): (req: Request, res: Response, next: NextFunction) => Promise<void> {
        return async (req, res, next) => {
            this.logger.info(`${handler.name}() ${req.method}-${req.originalUrl}`);
            try {
                // rebind this since reference is lost when passing class instance method due to nested functional scoping rules
                let responsePayload = await handler.bind(this)(req);
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