import {LoggerInstance} from "winston";
import {NextFunction} from "express";


export type RequestHandler<T> = (req: Request, res: Response, next: NextFunction) => Promise<T>;
export abstract class AbstractRoutesController {
    constructor (protected logger: LoggerInstance) {
    }

    handleRequest<T>(handler: RequestHandler<T>): RequestHandler<void>{
        return async (req, res, next) => {

            return null
        };
    }

    abstract registerRoutes ();
}