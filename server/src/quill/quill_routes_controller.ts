import * as express from 'express';
import {quillHandler} from './quill_handler';
import {getLogger} from '../log';

let router = express.Router();

const logger = getLogger('QuillRoutes', 'info');

router.get('/quill-data/:quillId', (request, response, next) => {
    (async () => {
        let quillId = request.params.quillId;
        try {
            let data = await quillHandler.loadQuillData(quillId);
            response.status(200).send(data);
        } catch (e) {
            response.status(500).send(e);
            logger.error('Error loading quill data for id: %s error: %s', quillId, e);
            logger.error(e.stack);
        }

    })();
});

export const QuillRoutes = router;