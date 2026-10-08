import { v4 as uuidv4 } from 'uuid';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import memoryStore from '../lib/memoryStore.js';
import logger from '../utils/logger.js';

export const projectController = {
  /**
   * GET /api/projects
   */
  async getProjects(req, res) {
    try {
      const userId = req.user.id;

      if (isSupabaseConfigured()) {
        const { data: projects, error } = await supabase
          .from('projects')
          .select(`
            *,
            files:files(count),
            insights:ai_insights(count)
          `)
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const formatted = projects.map(p => ({
          ...p,
          fileCount: p.files?.[0]?.count || 0,
          insightCount: p.insights?.[0]?.count || 0
        }));

        return res.json({ success: true, data: formatted });
      } else {
        const userProjects = memoryStore.projects
          .filter(p => p.user_id === userId)
          .map(p => {
            const files = memoryStore.files.filter(f => f.project_id === p.id);
            const insights = memoryStore.ai_insights.filter(i => i.project_id === p.id);
            return {
              ...p,
              fileCount: files.length,
              insightCount: insights.length
            };
          });

        return res.json({ success: true, data: userProjects });
      }
    } catch (err) {
      logger.error('Error fetching projects:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not fetch projects.',
        errorCode: 'FETCH_PROJECTS_FAILED'
      });
    }
  },

  /**
   * GET /api/projects/:id
   */
  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (isSupabaseConfigured()) {
        const { data: project, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single();

        if (error || !project) {
          return res.status(404).json({
            success: false,
            message: 'Project not found or unauthorized access.',
            errorCode: 'PROJECT_NOT_FOUND'
          });
        }

        return res.json({ success: true, data: project });
      } else {
        const project = memoryStore.projects.find(p => p.id === id && p.user_id === userId);
        if (!project) {
          return res.status(404).json({
            success: false,
            message: 'Project not found or unauthorized access.',
            errorCode: 'PROJECT_NOT_FOUND'
          });
        }
        return res.json({ success: true, data: project });
      }
    } catch (err) {
      logger.error(`Error fetching project ${req.params.id}:`, err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not fetch project details.',
        errorCode: 'FETCH_PROJECT_FAILED'
      });
    }
  },

  /**
   * POST /api/projects
   */
  async createProject(req, res) {
    try {
      const userId = req.user.id;
      const { name, description } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Project name is required.',
          errorCode: 'INVALID_NAME'
        });
      }

      const newProject = {
        name: name.trim(),
        description: description?.trim() || '',
        user_id: userId
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('projects')
          .insert(newProject)
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
      } else {
        const projectRecord = {
          id: uuidv4(),
          ...newProject,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          fileCount: 0,
          insightCount: 0
        };
        memoryStore.projects.unshift(projectRecord);
        return res.status(201).json({ success: true, data: projectRecord });
      }
    } catch (err) {
      logger.error('Error creating project:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not create project.',
        errorCode: 'CREATE_PROJECT_FAILED'
      });
    }
  },

  /**
   * PUT /api/projects/:id
   */
  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { name, description } = req.body;

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('projects')
          .update({
            name: name?.trim(),
            description: description?.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('user_id', userId)
          .select()
          .single();

        if (error || !data) {
          return res.status(404).json({
            success: false,
            message: 'Project not found or update unauthorized.',
            errorCode: 'UPDATE_FAILED'
          });
        }

        return res.json({ success: true, data });
      } else {
        const project = memoryStore.projects.find(p => p.id === id && p.user_id === userId);
        if (!project) {
          return res.status(404).json({
            success: false,
            message: 'Project not found.',
            errorCode: 'PROJECT_NOT_FOUND'
          });
        }

        if (name) project.name = name.trim();
        if (description !== undefined) project.description = description.trim();
        project.updated_at = new Date().toISOString();

        return res.json({ success: true, data: project });
      }
    } catch (err) {
      logger.error('Error updating project:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not update project.',
        errorCode: 'UPDATE_PROJECT_FAILED'
      });
    }
  },

  /**
   * DELETE /api/projects/:id
   */
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) throw error;
        return res.json({ success: true, message: 'Project successfully deleted.' });
      } else {
        const idx = memoryStore.projects.findIndex(p => p.id === id && p.user_id === userId);
        if (idx === -1) {
          return res.status(404).json({
            success: false,
            message: 'Project not found.',
            errorCode: 'PROJECT_NOT_FOUND'
          });
        }
        memoryStore.projects.splice(idx, 1);
        memoryStore.files = memoryStore.files.filter(f => f.project_id !== id);
        memoryStore.notes = memoryStore.notes.filter(n => n.project_id !== id);
        memoryStore.ai_insights = memoryStore.ai_insights.filter(i => i.project_id !== id);

        return res.json({ success: true, message: 'Project successfully deleted.' });
      }
    } catch (err) {
      logger.error('Error deleting project:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not delete project.',
        errorCode: 'DELETE_PROJECT_FAILED'
      });
    }
  },

  /**
   * POST /api/projects/seed-demo
   * Recreates or reloads the Factory Equipment Inspection demo project
   */
  async seedDemoProject(req, res) {
    try {
      const userId = req.user.id;
      const demoId = 'p0000000-0000-0000-0000-000000000001';

      if (isSupabaseConfigured()) {
        // Upsert demo project in Supabase
        const { data: proj, error: projErr } = await supabase
          .from('projects')
          .upsert({
            id: demoId,
            user_id: userId,
            name: 'Factory Equipment Inspection - Turbine 4B',
            description: 'Cross-modal forensic analysis of Turbine Unit 4B following reported anomalous vibrations and maintenance discrepancies.'
          })
          .select()
          .single();

        if (projErr) throw projErr;

        return res.json({ success: true, data: proj, message: 'Demo project seeded successfully.' });
      } else {
        // Reset or add demo project to user
        let proj = memoryStore.projects.find(p => p.id === demoId);
        if (!proj) {
          proj = {
            id: demoId,
            user_id: userId,
            name: 'Factory Equipment Inspection - Turbine 4B',
            description: 'Cross-modal forensic analysis of Turbine Unit 4B following reported anomalous vibrations and maintenance discrepancies.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          memoryStore.projects.unshift(proj);
        } else {
          proj.user_id = userId;
        }

        return res.json({ success: true, data: proj, message: 'Demo project seeded successfully.' });
      }
    } catch (err) {
      logger.error('Error seeding demo project:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not load demo project.',
        errorCode: 'SEED_DEMO_FAILED'
      });
    }
  }
};

export default projectController;

