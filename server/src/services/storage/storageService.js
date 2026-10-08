import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '../../config/supabase.js';
import config from '../../config/env.js';
import logger from '../../utils/logger.js';
import { sanitizeFilename } from '../../utils/sanitize.js';

// Local disk fallback directory when Supabase is not connected
const LOCAL_STORAGE_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
  fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
}

export const storageService = {
  /**
   * Upload file buffer or stream to Supabase Storage
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.projectId
   * @param {string} params.fileId
   * @param {string} params.fileName
   * @param {Buffer} params.fileBuffer
   * @param {string} params.mimeType
   * @returns {Promise<{ storagePath: string, publicUrl?: string }>}
   */
  async uploadFile({ userId, projectId, fileId, fileName, fileBuffer, mimeType }) {
    const cleanName = sanitizeFilename(fileName);
    const storagePath = `${userId}/${projectId}/${fileId}/${cleanName}`;

    if (isSupabaseConfigured()) {
      const bucket = config.supabase.storageBucket;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true
        });

      if (error) {
        logger.error(`Supabase storage upload error for ${storagePath}:`, error.message);
        throw new Error(`Storage upload failed: ${error.message}`);
      }

      logger.info(`File successfully uploaded to Supabase Storage: ${storagePath}`);
      return { storagePath };
    } else {
      // Local development fallback
      const userProjectDir = path.join(LOCAL_STORAGE_DIR, userId, projectId, fileId);
      if (!fs.existsSync(userProjectDir)) {
        fs.mkdirSync(userProjectDir, { recursive: true });
      }
      const localFilePath = path.join(userProjectDir, cleanName);
      fs.writeFileSync(localFilePath, fileBuffer);
      logger.info(`File stored in local fallback storage: ${localFilePath}`);
      return { storagePath };
    }
  },

  /**
   * Create a signed URL for secure private file download/preview
   * @param {string} storagePath 
   * @param {number} expiresInSeconds 
   * @returns {Promise<string>}
   */
  async getSignedUrl(storagePath, expiresInSeconds = 3600) {
    if (isSupabaseConfigured()) {
      const bucket = config.supabase.storageBucket;
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(storagePath, expiresInSeconds);

      if (error) {
        logger.error(`Failed to create signed URL for ${storagePath}:`, error.message);
        throw new Error(`Failed to create signed download URL: ${error.message}`);
      }

      return data.signedUrl;
    }

    // In local fallback, return local API static serve URL
    return `/api/files/download/${encodeURIComponent(storagePath)}`;
  },

  /**
   * Delete a file from storage
   * @param {string} storagePath 
   */
  async deleteFile(storagePath) {
    if (isSupabaseConfigured()) {
      const bucket = config.supabase.storageBucket;
      const { error } = await supabase.storage
        .from(bucket)
        .remove([storagePath]);

      if (error) {
        logger.error(`Error deleting storage file ${storagePath}:`, error.message);
      }
    } else {
      const localFilePath = path.join(LOCAL_STORAGE_DIR, storagePath);
      if (fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
        } catch (e) {
          logger.warn(`Could not delete local file ${localFilePath}`);
        }
      }
    }
  },

  /**
   * Read file content buffer from storage
   * @param {string} storagePath
   * @returns {Promise<Buffer>}
   */
  async getFileBuffer(storagePath) {
    if (isSupabaseConfigured()) {
      const bucket = config.supabase.storageBucket;
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(storagePath);

      if (error || !data) {
        throw new Error(`Failed to download file from storage: ${error?.message || 'Empty data'}`);
      }
      const arrayBuffer = await data.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } else {
      const localFilePath = path.join(LOCAL_STORAGE_DIR, storagePath);
      if (fs.existsSync(localFilePath)) {
        return fs.readFileSync(localFilePath);
      }
      throw new Error(`Local file not found: ${localFilePath}`);
    }
  }
};

export default storageService;
