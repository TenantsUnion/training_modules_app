import * as express from 'express';
import {Router, Request, Response} from 'express';
import {CreateUserContentCommand} from "content";
import {UserContentHandler, userContentHandler} from "./user_content_handler";
import {getLogger} from '../../log';
import {contentRepository} from "../content_repository";
import {
    UserContentValidator,
    userContentValidator
} from "./user_content_validator";

let logger = getLogger('userContentController', 'info');

export interface UpdateUserContentCommand {
    userId: string;
    contentDataId: string,
    title: string,
    tags: string[]
    content: { [index: string]: any }
}

export class UserContentController {
    constructor (private userContentHandler: UserContentHandler,
                 private userContentValidator: UserContentValidator) {
    }

    create (request: Request, response: Response) {
        let createContent: CreateUserContentCommand = request.body;
        (async () => {
            try {
                //todo validate
                let error = await this.userContentValidator.create(createContent);
                if(error){
                    return response.status(400).send(error);
                }
                await this.userContentHandler.handleCreateUserContentCommand(createContent);
                response.status(200)
                    .send();
            } catch (e) {
                logger.error('Error handling create user content command');
                logger.error(e);
                response.status(500) //server error
                    .send(e);
            }
        })();
    }

    update (request: Request, response: Response) {
        let updateUserContentCommand: UpdateUserContentCommand = request.body;
        (async () => {
            try {
                //todo validate
                await this.userContentHandler.handleUpdateUserContentCommand(updateUserContentCommand);
                response.status(200)
                    .send();
            } catch (e) {
                logger.error('Error handling update user content command');
                logger.error(e);
                response.status(500)
                    .send(e);
            }
        })();
    }

    list (request: Request, response: Response) {
        let username = request.params.username;
        if (!username) {
            response.status(400)
                .send('Can\'t get content. No username specified.');
        }

        (async () => {
            try {
                let userContentEntity = contentRepository.getUserContent(username);
            } catch (e) {
                logger.error('Error getting content for user %s', username);
                logger.error(e);
                response.status(500)
                    .send(e);
            }
        })();
    }

    load (request: Request, response: Response) {
        let username = request.params.username;
        let contentId = request.params.quillDataId;
        if (!username) {
            response.status(400)
                .send('Can\'t get content. No username specified.');
        }

        if (!contentId) {
            response.status(400)
                .send('Can\'t get content. No content id specified.');
        }

        (async () => {
            try {
                let userContentEntity
                    = contentRepository.loadUserContent(username, contentId);
                response.status(200).send(userContentEntity);
            } catch (e) {
                logger.error('Error load content for user %s, content id %s', username, contentId);
                logger.error(e);
                response.status(500)
                    .send(e);
            }
        })();
    }
}

let userContentController =
    new UserContentController(userContentHandler, userContentValidator);

let router: Router = express.Router();
router.post('/user/:username/content/update', (request, response) => {
    userContentController.update(request, response);
});

router.post('/user/:username/content/create', (request, response) => {
    userContentController.create(request, response);
});

router.get('/user/:username/content', (request, response) => {
    userContentController.list(request, response);
});

router.get('/user/:username/content/:quillDataId', (request, response) => {
    userContentController.load(request, response);
});

export const ContentRoutes = router;
