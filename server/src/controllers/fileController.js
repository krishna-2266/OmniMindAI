import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import memoryStore from '../lib/memoryStore.js';
import storageService from '../services/storage/storageService.js';
import fileProcessingService from '../services/processing/fileProcessingService.js';
import logger from '../utils/logger.js';
import path from 'path';
import fs from 'fs';

export const fileController = {
  /**
   * GET /api/projects/:id/files
   */
  async getFilesByProject(req, res) {
    try {
      const { id: projectId } = req.params;
      const userId = req.user.id;

      if (isSupabaseConfigured()) {
        const { data: files, error } = await supabase
          .from('files')
          .select('*')
          .eq('project_id', projectId)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.json({ success: true, data: files });
      } else {
        const files = memoryStore.files.filter(f => f.project_id === projectId);
        return res.json({ success: true, data: files });
      }
    } catch (err) {
      logger.error('Error fetching project files:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not fetch files.',
        errorCode: 'FETCH_FILES_FAILED'
      });
    }
  },

  /**
   * POST /api/projects/:id/files
   */
  async uploadFile(req, res) {
    try {
      const { id: projectId } = req.params;
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded.',
          errorCode: 'FILE_MISSING'
        });
      }

      // Verify project ownership
      if (isSupabaseConfigured()) {
        const { data: project } = await supabase
          .from('projects')
          .select('id')
          .eq('id', projectId)
          .eq('user_id', userId)
          .single();

        if (!project) {
          return res.status(403).json({
            success: false,
            message: 'Unauthorized project access.',
            errorCode: 'FORBIDDEN'
          });
        }
      }

      const fileId = uuidv4();
      const fileName = file.originalname;
      const mimeType = file.mimetype;
      const fileSize = file.size;
      const fileBuffer = file.buffer;

      logger.info(`Starting upload and processing for ${fileName} (${fileSize} bytes)`);

      // 1. Upload to Supabase Storage
      const { storagePath } = await storageService.uploadFile({
        userId,
        projectId,
        fileId,
        fileName,
        fileBuffer,
        mimeType
      });

      // 2. Process file through modality engine
      let processed;
      try {
        processed = await fileProcessingService.processFile({
          buffer: fileBuffer,
          mimeType,
          fileName
        });
      } catch (procErr) {
        logger.error(`Processing failed for ${fileName}:`, procErr.message);
        processed = {
          modality: 'document',
          extractedText: '',
          aiSummary: 'Processing failed. File stored in repository.',
          metadata: { error: procErr.message }
        };
      }

      // 3. Save file record to database
      const fileRecord = {
        id: fileId,
        project_id: projectId,
        user_id: userId,
        original_name: fileName,
        storage_path: storagePath,
        mime_type: mimeType,
        file_size: fileSize,
        modality: processed.modality,
        processing_status: processed.extractedText || processed.aiSummary ? 'ready' : 'failed',
        extracted_text: processed.extractedText,
        ai_summary: processed.aiSummary,
        metadata: processed.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('files')
          .insert(fileRecord)
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
      } else {
        memoryStore.files.unshift(fileRecord);
        return res.status(201).json({ success: true, data: fileRecord });
      }
    } catch (err) {
      logger.error('Error during file upload flow:', err.message);
      return res.status(500).json({
        success: false,
        message: `File upload and processing failed: ${err.message}`,
        errorCode: 'UPLOAD_FAILED'
      });
    }
  },

  /**
   * GET /api/files/:id/signed-url
   */
  async getSignedUrl(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      let storagePath = '';
      if (isSupabaseConfigured()) {
        const { data: file, error } = await supabase
          .from('files')
          .select('storage_path')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error || !file) {
          return res.status(404).json({ success: false, message: 'File not found.', errorCode: 'NOT_FOUND' });
        }
        storagePath = file.storage_path;
      } else {
        const file = memoryStore.files.find(f => f.id === id);
        if (!file) {
          return res.status(404).json({ success: false, message: 'File not found.', errorCode: 'NOT_FOUND' });
        }
        storagePath = file.storage_path;
      }

      const signedUrl = await storageService.getSignedUrl(storagePath, 3600);
      return res.json({ success: true, data: { signedUrl } });
    } catch (err) {
      logger.error('Error creating signed URL:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not generate secure file URL.',
        errorCode: 'SIGNED_URL_FAILED'
      });
    }
  },

  /**
   * DELETE /api/files/:id
   */
  async deleteFile(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      let storagePath = null;
      if (isSupabaseConfigured()) {
        const { data: file } = await supabase
          .from('files')
          .select('storage_path')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (file) {
          storagePath = file.storage_path;
          await supabase.from('files').delete().eq('id', id).eq('user_id', userId);
        }
      } else {
        const idx = memoryStore.files.findIndex(f => f.id === id);
        if (idx !== -1) {
          storagePath = memoryStore.files[idx].storage_path;
          memoryStore.files.splice(idx, 1);
        }
      }

      if (storagePath) {
        await storageService.deleteFile(storagePath);
      }

      return res.json({ success: true, message: 'File successfully deleted.' });
    } catch (err) {
      logger.error('Error deleting file:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not delete file.',
        errorCode: 'DELETE_FILE_FAILED'
      });
    }
  },

  /**
   * GET /api/files/download/:storagePath
   * Fallback for downloading/previewing local files
   */
  async downloadLocalFile(req, res) {
    try {
      const decodedPath = decodeURIComponent(req.params.storagePath);
      const safePath = path.resolve(process.cwd(), 'uploads', decodedPath);

      if (fs.existsSync(safePath)) {
        return res.sendFile(safePath);
      }
      return res.status(404).send('File not found in local storage.');
    } catch (e) {
      return res.status(500).send('Error reading local file.');
    }
  }
};

export default fileController;
