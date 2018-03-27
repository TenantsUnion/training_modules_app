import {getLogger} from '@server/log';
import {quillHandler} from '@server/config/handler_config';
import {Router} from "express";

let router = Router();
const logger = getLogger('QuillRoutes', 'info');

router.get('/quill-data/:quillId', async (request, response, next) => {
    let quillId = request.params.quillId;
    try {
        let data = await quillHandler.loadQuillData(quillId);
        response.status(200).send(data);
    } catch (e) {
        response.status(500).send(e);
        logger.error('Error loading quill data for id: %s error: %s', quillId, e);
        logger.error(e.stack);
    }
});

export const QuillRoutes = router;