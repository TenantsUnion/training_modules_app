import * as express from 'express';
import {getLogger} from '../../../log';
import {quillHandler} from '../../../config/handler_config';

let router = express.Router();
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