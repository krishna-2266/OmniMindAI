import geminiService from '../ai/geminiService.js';
import logger from '../../utils/logger.js';

export const videoService = {
  /**
   * Process video evidence using Gemini Video Multimodal capabilities
   * @param {Buffer} buffer 
   * @param {string} mimeType 
   * @param {string} fileName 
   */
  async processVideo(buffer, mimeType, fileName = 'video.mp4') {
    try {
      logger.info(`Processing video evidence: ${fileName}`);

      let extractedText = '';
      let aiSummary = '';
      let metadata = {
        format: mimeType,
        sizeBytes: buffer.length
      };

      if (geminiService.isConfigured()) {
        const analysis = await geminiService.analyzeVideo({
          videoBuffer: buffer,
          mimeType,
          prompt: `Analyze this video recording "${fileName}". ` +
            `Produce a chronological timeline of visual and audio events, abnormal physical vibrations, ` +
            `sparks, leaks, smoke, or mechanical movements.`
        });

        extractedText = analysis.timeline || '';
        aiSummary = analysis.summary?.slice(0, 300) || 'Video timeline analysis completed.';
        metadata.hasGeminiVideo = true;
      } else {
        extractedText = `[Video Evidence: ${fileName}] Video recording registered in multimodal evidence layer. Ready for chronological timeline indexing.`;
        aiSummary = `Video "${fileName}" ingested. Connect Gemini API key for automated frame-by-frame anomaly detection and temporal timeline extraction.`;
      }

      return {
        extractedText,
        aiSummary,
        metadata
      };
    } catch (err) {
      logger.error(`Error processing video ${fileName}:`, err.message);
      throw err;
    }
  }
};

export default videoService;
