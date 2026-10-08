import { Router } from 'express';
import chatController from '../controllers/chatController.js';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);

router.post('/projects/:id/chat', aiLimiter, chatController.sendMessage);
router.get('/projects/:id/conversations', chatController.getConversations);
router.get('/conversations/:id/messages', chatController.getMessages);

export default router;
