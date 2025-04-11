import express from 'express';
import { getPositions } from '../controllers/positionsController.js';

const router = express.Router();

router.get('/', getPositions);

export default router;
