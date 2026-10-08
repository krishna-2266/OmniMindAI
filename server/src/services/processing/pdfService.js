import pdfParse from 'pdf-parse';
import geminiService from '../ai/geminiService.js';
import logger from '../../utils/logger.js';

export const pdfService = {
  /**
   * Extract text and metadata from PDF buffer
   * Falls back to Gemini Document Vision if scanned or text is scarce
   * @param {Buffer} buffer 
   * @param {string} fileName 
   * @returns {Promise<{ extractedText: string, aiSummary: string, metadata: object }>}
   */
  async processPdf(buffer, fileName = 'document.pdf') {
    try {
      let extractedText = '';
      let pageCount = 1;

      try {
        const parsed = await pdfParse(buffer);
        extractedText = (parsed.text || '').trim();
        pageCount = parsed.numpages || 1;
      } catch (pdfErr) {
        logger.warn(`pdf-parse failed on ${fileName}, attempting Gemini document vision:`, pdfErr.message);
      }

      // If text extraction yielded minimal text (e.g. scanned PDF), utilize Gemini Multimodal Document Vision
      if (extractedText.length < 50 && geminiService.isConfigured()) {
        logger.info(`PDF appears to be scanned or image-only (${fileName}). Invoking Gemini multimodal document processor...`);
        const visionResult = await geminiService.analyzeDocument({
          documentBuffer: buffer,
          mimeType: 'application/pdf',
          prompt: 'This is a scanned or image-based PDF document. Perform full OCR and transcribe all visible text, headers, numbers, tables, and notes verbatim.'
        });
        extractedText = visionResult.analysis || extractedText;
      }

      // Generate AI summary
      let aiSummary = '';
      if (geminiService.isConfigured() && extractedText.length > 0) {
        try {
          const summaryPrompt = `Provide a concise, factual 2-sentence summary of this document:\n\n${extractedText.slice(0, 4000)}`;
          aiSummary = await geminiService.generateContent({
            contents: [{ parts: [{ text: summaryPrompt }] }],
            systemInstruction: 'You summarize evidentiary documents with zero hallucination.',
            temperature: 0.1
          });
        } catch (sumErr) {
          logger.warn(`Could not generate PDF summary with Gemini: ${sumErr.message}`);
          aiSummary = `Document extracted (${extractedText.length} characters, ${pageCount} pages).`;
        }
      } else {
        aiSummary = `Document text extracted: ${extractedText.length} characters across ${pageCount} page(s).`;
      }

      return {
        extractedText,
        aiSummary,
        metadata: {
          pages: pageCount,
          characterCount: extractedText.length,
          extractionMethod: extractedText.length > 50 ? 'pdf-parse' : 'gemini-ocr'
        }
      };
    } catch (err) {
      logger.error(`Error processing PDF ${fileName}:`, err.message);
      throw err;
    }
  }
};

export default pdfService;

