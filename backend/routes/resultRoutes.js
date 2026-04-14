// backend/routes/resultRoutes.js

import express from 'express';
import {
  getAllResults,
  getResultById,
  getStatsSummary,
} from '../controllers/resultController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',               protect, getAllResults);
router.get('/stats/summary',  protect, getStatsSummary);
router.get('/:id',            protect, getResultById);

export default router;
