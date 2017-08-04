import * as express from 'express';
import {Router, Response, Request} from 'express';
import {LoginCredentials} from 'account';
import {IUserId} from "src/user/user_handler";
import {CreateUserContentCommand} from "../../../../shared/content";
import {UserContentHandler} from "./user_content_handler";

export class UserContentController {
    constructor (private userContentHandler: UserContentHandler) {}

    create (request: Request, response: Response) {
        console.log('handling signup');
        let createContent: CreateUserContentCommand = request.body;
        (async () => {
            let userId: IUserId | string;
            try {
                //validate
                await this.userContentHandler.handleCreateUserContentCommand(createContent);
            } catch (e) {
                console.log(e.stack);
                response.status(500) //server error
                    .send(e.stack.join('\n'));
            }

            if (typeof userId !== 'string') {
                request.session.user_id = userId.id;
                response.status(200)
                    .send(userId);
            } else {
                response.status(400)
                    .send(userId); //if userId is string it is an error message
            }
        })();
    }

    login (request: Request, response: Response) {
        console.log('handling login');
        let loginCredentials: LoginCredentials = request.body;
        (async () => {
            let userId: IUserId | string;
            try {

                // userId = await this.userContentHandler.login(loginCredentials);

            } catch (e) {
                console.log(e.stack);
                response.status(500)
                    .send(e.stack('\n'));
            }

            if (typeof userId !== 'string') {
                request.session.user_id = userId.id;
                response.status(200)
                    .send(userId);
            } else {
                response.status(400)
                    .send(userId); //if userId is string it is an error message
            }
        })();
    }
}

// let userContentController = new UserContentController(accountHandler);

let router: Router = express.Router();
router.post('/update', (request, response) => {
    // userContentController.login(request, response);
});

router.post('/create', (request, response) => {
    // userContentController.signup(request, response);
});

router.post('/delete', (request, response) => {

});

export const ContentRoutes = router;
