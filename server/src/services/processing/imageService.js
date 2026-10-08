import geminiService from '../ai/geminiService.js';
import logger from '../../utils/logger.js';

export const imageService = {
  /**
   * Process image buffer using Gemini Multimodal Vision
   * @param {Buffer} buffer 
   * @param {string} mimeType 
   * @param {string} fileName 
   */
  async processImage(buffer, mimeType, fileName = 'image.jpg') {
    try {
      logger.info(`Processing image through multimodal vision: ${fileName}`);

      let aiSummary = '';
      let extractedText = '';
      let metadata = {
        format: mimeType,
        sizeBytes: buffer.length
      };

      if (geminiService.isConfigured()) {
        const analysis = await geminiService.analyzeImage({
          imageBuffer: buffer,
          mimeType,
          prompt: `Perform an in-depth forensic visual evidence analysis of "${fileName}". ` +
            `Identify objects, structural anomalies, fractures, fluid leaks, wear patterns, labels, and text. ` +
            `Distinguish between directly visible physical features and inferences.`
        });

        extractedText = analysis.analysis || '';
        aiSummary = analysis.summary?.slice(0, 300) || 'Visual analysis completed.';
        metadata.hasGeminiVision = true;
      } else {
        extractedText = `[Visual Evidence: ${fileName}] High-resolution image ingested into unified evidence layer. Ready for multimodal cross-referencing.`;
        aiSummary = `Image "${fileName}" cataloged in evidence layer. Add Gemini API key for automated visual OCR and anomaly inspection.`;
      }

      return {
        extractedText,
        aiSummary,
        metadata
      };
    } catch (err) {
      logger.error(`Error processing image ${fileName}:`, err.message);
      throw err;
    }
  }
};

export default imageService;
