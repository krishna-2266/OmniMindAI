import { Router } from 'express';
import authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, authController.getMe);

export default router;
