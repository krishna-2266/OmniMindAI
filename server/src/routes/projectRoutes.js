import { Router } from 'express';
import projectController from '../controllers/projectController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.post('/seed-demo', projectController.seedDemoProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
