import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import memoryStore from '../lib/memoryStore.js';
import crossModalAnalysisService from '../services/ai/crossModalAnalysisService.js';
import logger from '../utils/logger.js';

export const analysisController = {
  /**
   * POST /api/projects/:id/analyze
   * Trigger cross-modal evidence reasoning across all project files and notes
   */
  async triggerAnalysis(req, res) {
    try {
      const { id: projectId } = req.params;
      const userId = req.user.id;
      const { focusQuery } = req.body;

      logger.info(`Initiating cross-modal analysis for project ${projectId} (Focus: "${focusQuery || 'General'}")`);

      let files = [];
      let notes = [];

      if (isSupabaseConfigured()) {
        const [filesRes, notesRes] = await Promise.all([
          supabase.from('files').select('*').eq('project_id', projectId).eq('user_id', userId),
          supabase.from('notes').select('*').eq('project_id', projectId).eq('user_id', userId)
        ]);

        if (filesRes.error) throw filesRes.error;
        if (notesRes.error) throw notesRes.error;

        files = filesRes.data || [];
        notes = notesRes.data || [];
      } else {
        files = memoryStore.files.filter(f => f.project_id === projectId);
        notes = memoryStore.notes.filter(n => n.project_id === projectId);
      }

      // Execute cross-modal reasoning
      const insight = await crossModalAnalysisService.analyzeEvidence({
        files,
        notes,
        focusQuery
      });

      // Persist generated insight
      const insightRecord = {
        id: uuidv4(),
        project_id: projectId,
        user_id: userId,
        summary: insight.summary,
        key_findings: insight.keyFindings,
        cross_modal_connections: insight.crossModalConnections,
        contradictions: insight.contradictions,
        risks: insight.risks,
        recommendations: insight.recommendations,
        sources: insight.sources,
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('ai_insights')
          .insert(insightRecord)
          .select()
          .single();

        if (error) {
          logger.warn('Could not persist insight to Supabase:', error.message);
          return res.status(200).json({ success: true, data: insightRecord });
        }
        return res.status(200).json({ success: true, data });
      } else {
        memoryStore.ai_insights.unshift(insightRecord);
        return res.status(200).json({ success: true, data: insightRecord });
      }
    } catch (err) {
      logger.error('Error generating cross-modal analysis:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Cross-modal analysis temporarily unavailable. Please try again.',
        errorCode: 'ANALYSIS_FAILED'
      });
    }
  },

  /**
   * GET /api/projects/:id/insights
   * Retrieve previous insights for this project
   */
  async getInsights(req, res) {
    try {
      const { id: projectId } = req.params;
      const userId = req.user.id;

      if (isSupabaseConfigured()) {
        const { data: insights, error } = await supabase
          .from('ai_insights')
          .select('*')
          .eq('project_id', projectId)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.json({ success: true, data: insights });
      } else {
        const insights = memoryStore.ai_insights
          .filter(i => i.project_id === projectId)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return res.json({ success: true, data: insights });
      }
    } catch (err) {
      logger.error('Error fetching project insights:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not fetch insights.',
        errorCode: 'FETCH_INSIGHTS_FAILED'
      });
    }
  }
};

export default analysisController;
