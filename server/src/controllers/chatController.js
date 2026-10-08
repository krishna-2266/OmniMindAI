import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import memoryStore from '../lib/memoryStore.js';
import chatService from '../services/ai/chatService.js';
import logger from '../utils/logger.js';

export const chatController = {
  /**
   * POST /api/projects/:id/chat
   */
  async sendMessage(req, res) {
    try {
      const { id: projectId } = req.params;
      const userId = req.user.id;
      const { message, conversationId } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Message content is required.',
          errorCode: 'INVALID_MESSAGE'
        });
      }

      // 1. Get or create conversation
      let activeConvId = conversationId;
      if (!activeConvId) {
        if (isSupabaseConfigured()) {
          const { data: conv, error: convErr } = await supabase
            .from('conversations')
            .insert({
              project_id: projectId,
              user_id: userId,
              title: message.slice(0, 40) + '...'
            })
            .select()
            .single();

          if (convErr) throw convErr;
          activeConvId = conv.id;
        } else {
          let conv = memoryStore.conversations.find(c => c.project_id === projectId);
          if (!conv) {
            conv = {
              id: uuidv4(),
              project_id: projectId,
              user_id: userId,
              title: message.slice(0, 40) + '...',
              created_at: new Date().toISOString()
            };
            memoryStore.conversations.push(conv);
          }
          activeConvId = conv.id;
        }
      }

      // 2. Fetch recent conversation history
      let history = [];
      if (isSupabaseConfigured()) {
        const { data: pastMessages } = await supabase
          .from('messages')
          .select('role, content')
          .eq('conversation_id', activeConvId)
          .order('created_at', { ascending: true })
          .limit(8);

        history = pastMessages || [];
      } else {
        history = memoryStore.messages
          .filter(m => m.conversation_id === activeConvId)
          .map(m => ({ role: m.role, content: m.content }));
      }

      // 3. Fetch project files & notes for evidence context
      let files = [];
      let notes = [];
      if (isSupabaseConfigured()) {
        const [fRes, nRes] = await Promise.all([
          supabase.from('files').select('*').eq('project_id', projectId).eq('user_id', userId),
          supabase.from('notes').select('*').eq('project_id', projectId).eq('user_id', userId)
        ]);
        files = fRes.data || [];
        notes = nRes.data || [];
      } else {
        files = memoryStore.files.filter(f => f.project_id === projectId);
        notes = memoryStore.notes.filter(n => n.project_id === projectId);
      }

      // 4. Save user message to database
      const userMsgRecord = {
        id: uuidv4(),
        conversation_id: activeConvId,
        user_id: userId,
        role: 'user',
        content: message.trim(),
        sources: [],
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured()) {
        await supabase.from('messages').insert(userMsgRecord);
      } else {
        memoryStore.messages.push(userMsgRecord);
      }

      // 5. Generate AI answer with multimodal reasoning
      const aiResponse = await chatService.processChatMessage({
        userMessage: message.trim(),
        history,
        files,
        notes
      });

      // 6. Save assistant message to database
      const assistantMsgRecord = {
        id: uuidv4(),
        conversation_id: activeConvId,
        user_id: userId,
        role: 'assistant',
        content: aiResponse.answer,
        sources: aiResponse.sources,
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured()) {
        await supabase.from('messages').insert(assistantMsgRecord);
      } else {
        memoryStore.messages.push(assistantMsgRecord);
      }

      return res.json({
        success: true,
        data: {
          conversationId: activeConvId,
          userMessage: userMsgRecord,
          assistantMessage: assistantMsgRecord
        }
      });
    } catch (err) {
      logger.error('Error handling chat message:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not process chat message.',
        errorCode: 'CHAT_FAILED'
      });
    }
  },

  /**
   * GET /api/projects/:id/conversations
   */
  async getConversations(req, res) {
    try {
      const { id: projectId } = req.params;
      const userId = req.user.id;

      if (isSupabaseConfigured()) {
        const { data: convs, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('project_id', projectId)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.json({ success: true, data: convs });
      } else {
        const convs = memoryStore.conversations.filter(c => c.project_id === projectId);
        return res.json({ success: true, data: convs });
      }
    } catch (err) {
      logger.error('Error fetching conversations:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not fetch conversations.',
        errorCode: 'FETCH_CONVERSATIONS_FAILED'
      });
    }
  },

  /**
   * GET /api/conversations/:id/messages
   */
  async getMessages(req, res) {
    try {
      const { id: convId } = req.params;

      if (isSupabaseConfigured()) {
        const { data: msgs, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return res.json({ success: true, data: msgs });
      } else {
        const msgs = memoryStore.messages
          .filter(m => m.conversation_id === convId)
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        return res.json({ success: true, data: msgs });
      }
    } catch (err) {
      logger.error('Error fetching messages:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not fetch conversation messages.',
        errorCode: 'FETCH_MESSAGES_FAILED'
      });
    }
  }
};

export default chatController;
