import { Router } from 'express';
import fileController from '../controllers/fileController.js';
import { requireAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// Public/direct download route for local fallback storage preview
router.get('/download/:storagePath', fileController.downloadLocalFile);

// Protected routes
router.use(requireAuth);

router.get('/projects/:id/files', fileController.getFilesByProject);
router.post('/projects/:id/files', upload.single('file'), fileController.uploadFile);
router.get('/:id/signed-url', fileController.getSignedUrl);
router.delete('/:id', fileController.deleteFile);

export default router;
