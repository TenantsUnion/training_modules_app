import * as express from "express";
import {userContentController} from "../config/web_controller_config";

let router = express.Router();

router.post('/user/:username/contentId/:contentId/save', (request, response) => {
    userContentController.update(request, response);
});

router.post('/user/:username/content/create', (request, response) => {
    userContentController.create(request, response);
});

router.get('/user/:username/content', (request, response) => {
    userContentController.list(request, response);
});

router.get('/user/:username/contentId/:quillDataId', (request, response) => {
    userContentController.load(request, response);
});

export const UserContentRoutes = router;
