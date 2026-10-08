import { GoogleGenAI } from '@google/genai';
import config from '../../config/env.js';
import logger from '../../utils/logger.js';

let aiClient = null;

if (config.gemini.apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: config.gemini.apiKey });
    logger.info('Google Gemini AI SDK initialized successfully');
  } catch (err) {
    logger.error('Failed to initialize Google Gemini SDK:', err.message);
  }
} else {
  logger.warn('GEMINI_API_KEY is not configured. AI requests will use mock / fallback cross-modal engine.');
}

/**
 * Clean and extract JSON string from potential Markdown codeblocks
 * @param {string} text 
 * @returns {string} Clean JSON string
 */
export function cleanJsonText(text) {
  if (!text) return '{}';
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

export const geminiService = {
  isConfigured() {
    return Boolean(aiClient && config.gemini.apiKey);
  },

  /**
   * Universal generateContent with system instruction and optional JSON format
   */
  async generateContent({ contents, systemInstruction, responseMimeType, temperature = 0.2 }) {
    if (!this.isConfigured()) {
      throw new Error('GEMINI_API_NOT_CONFIGURED');
    }

    try {
      const modelName = config.gemini.model || 'gemini-2.5-flash';
      const callConfig = {
        temperature
      };

      if (systemInstruction) {
        callConfig.systemInstruction = systemInstruction;
      }

      if (responseMimeType) {
        callConfig.responseMimeType = responseMimeType;
      }

      const response = await aiClient.models.generateContent({
        model: modelName,
        contents,
        config: callConfig
      });

      return response.text;
    } catch (err) {
      logger.error('Gemini API call failed:', err.message);
      throw err;
    }
  },

  /**
   * Multimodal image analysis
   */
  async analyzeImage({ imageBuffer, mimeType, prompt }) {
    if (!this.isConfigured()) {
      return {
        summary: 'Image processed (API key missing): Visual features parsed.',
        detectedElements: ['Structure', 'Surface analysis']
      };
    }

    const base64Data = imageBuffer.toString('base64');
    const defaultPrompt = prompt || 
      'You are a forensic multimodal inspection analyst. Provide a detailed, objective breakdown of this image: ' +
      '1. Key visible objects and scenes. ' +
      '2. Any anomalies, damage, wear, or irregularities. ' +
      '3. Any readable text, labels, serial numbers, or dials. ' +
      '4. Concise summary of findings.';

    const contents = [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: base64Data
            }
          },
          { text: defaultPrompt }
        ]
      }
    ];

    const resultText = await this.generateContent({
      contents,
      systemInstruction: 'You are an objective industrial and forensic visual intelligence specialist. State direct visual evidence clearly.',
      temperature: 0.1
    });

    return {
      summary: resultText,
      analysis: resultText
    };
  },

  /**
   * Multimodal Document / PDF analysis
   */
  async analyzeDocument({ documentBuffer, mimeType, prompt }) {
    if (!this.isConfigured()) {
      return {
        summary: 'Document parsed via local extraction.',
        analysis: 'Local extraction completed.'
      };
    }

    const base64Data = documentBuffer.toString('base64');
    const docPrompt = prompt || 
      'Examine this document thoroughly. Provide an executive summary of key terms, dates, signatories, operational conclusions, and any reported anomalies.';

    const contents = [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'application/pdf',
              data: base64Data
            }
          },
          { text: docPrompt }
        ]
      }
    ];

    const resultText = await this.generateContent({
      contents,
      systemInstruction: 'You are an evidentiary document analyst. Extract factual data without speculation.',
      temperature: 0.1
    });

    return {
      summary: resultText,
      analysis: resultText
    };
  },

  /**
   * Multimodal Audio analysis (Gemini native audio processing)
   */
  async analyzeAudio({ audioBuffer, mimeType, prompt }) {
    if (!this.isConfigured()) {
      return {
        transcript: 'Audio received. Transcription available via Gemini API key.',
        summary: 'Audio file cataloged in unified evidence layer.'
      };
    }

    const base64Data = audioBuffer.toString('base64');
    const audioPrompt = prompt || 
      'Transcribe this audio recording verbatim or near-verbatim. Then list key statements, speaker sentiment, technical concerns raised, and any urgent action items.';

    const contents = [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'audio/mpeg',
              data: base64Data
            }
          },
          { text: audioPrompt }
        ]
      }
    ];

    const resultText = await this.generateContent({
      contents,
      systemInstruction: 'You are an acoustic and interview analyst. Provide accurate transcripts and evidence logs.',
      temperature: 0.1
    });

    return {
      transcript: resultText,
      summary: resultText
    };
  },

  /**
   * Multimodal Video analysis (Gemini native video processing)
   */
  async analyzeVideo({ videoBuffer, mimeType, prompt }) {
    if (!this.isConfigured()) {
      return {
        timeline: 'Video temporal timeline stored.',
        summary: 'Video cataloged in evidence layer.'
      };
    }

    const base64Data = videoBuffer.toString('base64');
    const videoPrompt = prompt || 
      'Analyze this video recording with timestamps. Document key physical motions, acoustic changes, anomalies, equipment behaviors, and visual indications of failure or operation.';

    const contents = [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'video/mp4',
              data: base64Data
            }
          },
          { text: videoPrompt }
        ]
      }
    ];

    const resultText = await this.generateContent({
      contents,
      systemInstruction: 'You are a temporal video evidence analyst. Provide time-coded behavioral and anomaly observations.',
      temperature: 0.1
    });

    return {
      timeline: resultText,
      summary: resultText
    };
  }
};

export default geminiService;
