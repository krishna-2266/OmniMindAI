import { Router } from 'express';
import analysisController from '../controllers/analysisController.js';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);

router.post('/projects/:id/analyze', aiLimiter, analysisController.triggerAnalysis);
router.get('/projects/:id/insights', analysisController.getInsights);

export default router;
