import geminiService from '../ai/geminiService.js';
import logger from '../../utils/logger.js';

export const audioService = {
  /**
   * Process audio file using Gemini Multimodal Audio
   * @param {Buffer} buffer 
   * @param {string} mimeType 
   * @param {string} fileName 
   */
  async processAudio(buffer, mimeType, fileName = 'audio.mp3') {
    try {
      logger.info(`Processing audio evidence: ${fileName}`);

      let extractedText = '';
      let aiSummary = '';
      let metadata = {
        format: mimeType,
        sizeBytes: buffer.length
      };

      if (geminiService.isConfigured()) {
        const analysis = await geminiService.analyzeAudio({
          audioBuffer: buffer,
          mimeType,
          prompt: `Transcribe this audio recording from "${fileName}". ` +
            `Extract verbatim statements, vocal tone/urgency, specific metrics, equipment tags, and named personnel.`
        });

        extractedText = analysis.transcript || '';
        aiSummary = analysis.summary?.slice(0, 300) || 'Audio transcription completed.';
        metadata.hasGeminiAudio = true;
      } else {
        extractedText = `[Audio Recording: ${fileName}] Acoustic recording ingested into evidence layer. Verbatim audio available for cross-modal indexing.`;
        aiSummary = `Audio "${fileName}" uploaded. Provide Gemini API key to trigger automated deep audio transcription and acoustic sentiment parsing.`;
      }

      return {
        extractedText,
        aiSummary,
        metadata
      };
    } catch (err) {
      logger.error(`Error processing audio ${fileName}:`, err.message);
      throw err;
    }
  }
};

export default audioService;
