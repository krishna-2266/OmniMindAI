import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import memoryStore from '../lib/memoryStore.js';
import logger from '../utils/logger.js';

export const noteController = {
  /**
   * GET /api/projects/:id/notes
   */
  async getNotes(req, res) {
    try {
      const { id: projectId } = req.params;
      const userId = req.user.id;

      if (isSupabaseConfigured()) {
        const { data: notes, error } = await supabase
          .from('notes')
          .select('*')
          .eq('project_id', projectId)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.json({ success: true, data: notes });
      } else {
        const notes = memoryStore.notes.filter(n => n.project_id === projectId);
        return res.json({ success: true, data: notes });
      }
    } catch (err) {
      logger.error('Error fetching notes:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not fetch notes.',
        errorCode: 'FETCH_NOTES_FAILED'
      });
    }
  },

  /**
   * POST /api/projects/:id/notes
   */
  async createNote(req, res) {
    try {
      const { id: projectId } = req.params;
      const userId = req.user.id;
      const { content } = req.body;

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Note content cannot be empty.',
          errorCode: 'INVALID_NOTE'
        });
      }

      const noteRecord = {
        id: uuidv4(),
        project_id: projectId,
        user_id: userId,
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('notes')
          .insert(noteRecord)
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
      } else {
        memoryStore.notes.unshift(noteRecord);
        return res.status(201).json({ success: true, data: noteRecord });
      }
    } catch (err) {
      logger.error('Error creating note:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not save note.',
        errorCode: 'CREATE_NOTE_FAILED'
      });
    }
  },

  /**
   * DELETE /api/notes/:id
   */
  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) throw error;
        return res.json({ success: true, message: 'Note deleted.' });
      } else {
        const idx = memoryStore.notes.findIndex(n => n.id === id);
        if (idx !== -1) {
          memoryStore.notes.splice(idx, 1);
        }
        return res.json({ success: true, message: 'Note deleted.' });
      }
    } catch (err) {
      logger.error('Error deleting note:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not delete note.',
        errorCode: 'DELETE_NOTE_FAILED'
      });
    }
  }
};

export default noteController;

