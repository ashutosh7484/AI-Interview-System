// backend/routes/interviewRoutes.js

import express from 'express';
import {
  startInterview,
  submitInterview,
  getInterviewHistory,
  getInterviewById,
} from '../controllers/interviewController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All interview routes are protected
router.post('/start',      protect, startInterview);
router.post('/submit',     protect, submitInterview);
router.get('/history',     protect, getInterviewHistory);
router.get('/:id',         protect, getInterviewById);

export default router;