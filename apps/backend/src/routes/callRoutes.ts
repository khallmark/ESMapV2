import express from 'express';
import { getMapData, getCallList, getCallDetails } from '../controllers/callController';

const router = express.Router();

router.get('/map', getMapData);
router.get('/list', getCallList);
router.get('/:id', getCallDetails);

export default router;