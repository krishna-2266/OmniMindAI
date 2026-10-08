import { Router } from 'express';
import noteController from '../controllers/noteController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/projects/:id/notes', noteController.getNotes);
router.post('/projects/:id/notes', noteController.createNote);
router.delete('/:id', noteController.deleteNote);

export default router;
