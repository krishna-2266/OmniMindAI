import { detectModality } from '../../utils/sanitize.js';
import pdfService from './pdfService.js';
import imageService from './imageService.js';
import audioService from './audioService.js';
import videoService from './videoService.js';
import logger from '../../utils/logger.js';

export const fileProcessingService = {
  /**
   * Process an uploaded file buffer based on its modality
   * @param {Object} params
   * @param {Buffer} params.buffer
   * @param {string} params.mimeType
   * @param {string} params.fileName
   * @returns {Promise<{ modality: string, extractedText: string, aiSummary: string, metadata: object }>}
   */
  async processFile({ buffer, mimeType, fileName }) {
    const modality = detectModality(mimeType, fileName);
    logger.info(`Starting ingestion pipeline for "${fileName}" (Detected Modality: ${modality})`);

    let extractedText = '';
    let aiSummary = '';
    let metadata = {};

    switch (modality) {
      case 'pdf': {
        const result = await pdfService.processPdf(buffer, fileName);
        extractedText = result.extractedText;
        aiSummary = result.aiSummary;
        metadata = result.metadata;
        break;
      }

      case 'image': {
        const result = await imageService.processImage(buffer, mimeType, fileName);
        extractedText = result.extractedText;
        aiSummary = result.aiSummary;
        metadata = result.metadata;
        break;
      }

      case 'audio': {
        const result = await audioService.processAudio(buffer, mimeType, fileName);
        extractedText = result.extractedText;
        aiSummary = result.aiSummary;
        metadata = result.metadata;
        break;
      }

      case 'video': {
        const result = await videoService.processVideo(buffer, mimeType, fileName);
        extractedText = result.extractedText;
        aiSummary = result.aiSummary;
        metadata = result.metadata;
        break;
      }

      case 'text':
      case 'document':
      default: {
        extractedText = buffer.toString('utf-8');
        aiSummary = `Text document containing ${extractedText.length} characters.`;
        metadata = {
          length: extractedText.length,
          wordCount: extractedText.split(/\s+/).filter(Boolean).length
        };
        break;
      }
    }

    return {
      modality,
      extractedText,
      aiSummary,
      metadata
    };
  }
};

export default fileProcessingService;

