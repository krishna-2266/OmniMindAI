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

        const formatted = (projects || []).map(p => ({
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
   * Fully seeds the Factory Equipment Inspection demo suite (project, files, notes, insights, chat)
   */
  async seedDemoProject(req, res) {
    try {
      let userId = req.user?.id || memoryStore.demoUserId;

      if (isSupabaseConfigured()) {
        // Ensure userId exists in auth.users
        const { data: userCheck } = await supabase.auth.admin.getUserById(userId);
        if (!userCheck?.user) {
          const { data: allUsers } = await supabase.auth.admin.listUsers();
          if (allUsers?.users?.length > 0) {
            userId = allUsers.users[0].id;
          } else {
            const { data: created } = await supabase.auth.admin.createUser({
              id: userId,
              email: 'demo@omnimind.ai',
              email_confirm: true
            });
            if (created?.user) userId = created.user.id;
          }
        }

        // 1. Check or create project
        const { data: existingProjects } = await supabase
          .from('projects')
          .select('id')
          .eq('user_id', userId)
          .ilike('name', '%Turbine 4B%')
          .limit(1);

        const projectId = existingProjects?.[0]?.id || uuidv4();

        const { data: proj, error: projErr } = await supabase
          .from('projects')
          .upsert({
            id: projectId,
            user_id: userId,
            name: 'Factory Equipment Inspection - Turbine 4B',
            description: 'Cross-modal forensic analysis of Turbine Unit 4B following reported anomalous vibrations and maintenance discrepancies.'
          })
          .select()
          .single();

        if (projErr) throw projErr;

        // 2. Populate evidence files
        const { data: existingFiles } = await supabase
          .from('files')
          .select('id')
          .eq('project_id', projectId);

        if (!existingFiles || existingFiles.length === 0) {
          await supabase.from('files').insert([
            {
              id: uuidv4(),
              project_id: projectId,
              user_id: userId,
              original_name: 'equipment_report.pdf',
              storage_path: `${userId}/${projectId}/equipment_report.pdf`,
              mime_type: 'application/pdf',
              file_size: 245800,
              modality: 'pdf',
              processing_status: 'ready',
              extracted_text: 'TURBINE UNIT 4B ROUTINE INSPECTION REPORT\nDate: Oct 02, 2024\nInspector: Chief Tech R. Vance\nStatus: OPERATIONAL - NORMAL\nBearing Temperatures: 62°C (Acceptable tolerance < 70°C)\nRotor Shaft Vibration: 1.2 mm/s (Acceptable threshold < 2.5 mm/s)\nHydraulic Seals: Verified intact, zero visible leaks.\nLubrication Pressure: Constant at 45 PSI.\nConclusion: Equipment certified for continuous uninhibited operation through Q4.',
              ai_summary: 'Routine inspection report claiming Turbine Unit 4B is in normal condition with 1.2 mm/s vibration and intact seals.',
              metadata: { pages: 3, author: 'Chief Tech R. Vance', signoffDate: '2024-10-02' }
            },
            {
              id: uuidv4(),
              project_id: projectId,
              user_id: userId,
              original_name: 'damaged_machine.jpg',
              storage_path: `${userId}/${projectId}/damaged_machine.jpg`,
              mime_type: 'image/jpeg',
              file_size: 1840000,
              modality: 'image',
              processing_status: 'ready',
              extracted_text: '[Visual Analysis] Visual inspection of Turbine Unit 4B lower bearing housing and drive shaft coupling flange.',
              ai_summary: 'High-resolution photograph reveals severe hairline fatigue cracking across the lower bearing bracket flange, accompanied by dark scorched oil residue and accumulated metallic micro-shavings around the seal circumference. Drive shaft coupling is visibly skewed 3-4° off-axis.',
              metadata: { resolution: '3840x2160', detectedAnomalies: ['hairline_fractures', 'scorched_oil', 'metal_shavings', 'misalignment'] }
            },
            {
              id: uuidv4(),
              project_id: projectId,
              user_id: userId,
              original_name: 'technician_interview.mp3',
              storage_path: `${userId}/${projectId}/technician_interview.mp3`,
              mime_type: 'audio/mpeg',
              file_size: 3450000,
              modality: 'audio',
              processing_status: 'ready',
              extracted_text: 'TRANSCRIPT - Senior Tech Dave Miller (Oct 05, 2024, 08:30 AM):\n"We ran Unit 4B under 80% load yesterday afternoon and immediately felt a heavy rhythmic grinding kicking in right at 1800 RPM. Control room SCADA showed green metrics, but you could physically feel the entire metal mezzanine shaking under your boots. That lower housing is running way hotter than the 62 degrees in Vance\'s paper—I clocked it over 88°C on my thermal spotter. If they run this during peak tomorrow, that shaft will seize solid."',
              ai_summary: 'Technician audio interview warning of severe rhythmic grinding at 1800 RPM, deck vibrations, thermal hotspot exceeding 88°C, and warning of catastrophic shaft seizure.',
              metadata: { durationSeconds: 142, speaker: 'Dave Miller', sentiment: 'urgent_warning' }
            },
            {
              id: uuidv4(),
              project_id: projectId,
              user_id: userId,
              original_name: 'inspection_video.mp4',
              storage_path: `${userId}/${projectId}/inspection_video.mp4`,
              mime_type: 'video/mp4',
              file_size: 12400000,
              modality: 'video',
              processing_status: 'ready',
              extracted_text: '[Video Frame Timeline Analysis]:\n00:00-00:08: RPM spin-up sequence.\n00:09-00:15: Distinct lateral wobble observable on driveshaft coupling with intermittent electrical/friction sparks.\n00:16-00:24: Dark fluid seepage spraying beneath bearing housing, vaporizing upon thermal contact.\n00:25-00:30: Lateral deflection exceeds 4.2mm, matching technician report of deck vibration.',
              ai_summary: 'High-frame-rate video analysis confirms severe shaft wobble (>4.2mm lateral deflection), intermittent friction sparking, and fluid vaporization under thermal load.',
              metadata: { durationSeconds: 30, fps: 60, keyEvents: ['lateral_wobble', 'friction_sparking', 'fluid_vaporization'] }
            }
          ]);
        }

        // 3. Populate emergency notes
        const { data: existingNotes } = await supabase
          .from('notes')
          .select('id')
          .eq('project_id', projectId);

        if (!existingNotes || existingNotes.length === 0) {
          await supabase.from('notes').insert([
            {
              id: uuidv4(),
              project_id: projectId,
              user_id: userId,
              content: 'EMERGENCY SHIFT NOTE (Oct 06, 2024 - D. Miller):\nBypassed automated oiler because line pressure collapsed. Disassembled secondary filter basket and discovered extensive bronze/steel flakes trapped in the mesh. Tagged turbine breaker with preliminary warning. Do NOT remove lock without ultrasonic non-destructive testing of rotor core.'
            }
          ]);
        }

        // 4. Populate AI Insights
        const { data: existingInsights } = await supabase
          .from('ai_insights')
          .select('id')
          .eq('project_id', projectId);

        if (!existingInsights || existingInsights.length === 0) {
          await supabase.from('ai_insights').insert([
            {
              id: uuidv4(),
              project_id: projectId,
              user_id: userId,
              summary: 'Cross-modal synthesis reveals an impending catastrophic bearing seizure and rotor fatigue failure on Turbine Unit 4B. While the written PDF inspection certified the unit as normal with 1.2 mm/s vibration, physical photograph, high-speed video, technician audio, and shift notes collectively prove severe unmonitored structural disintegration, excessive 4.2mm shaft deflection, and thermal overheating.',
              key_findings: [
                {
                  finding: 'Severe structural fatigue with hairline cracks and off-axis coupling tilt (3-4°)',
                  severity: 'CRITICAL',
                  sources: ['damaged_machine.jpg', 'inspection_video.mp4']
                },
                {
                  finding: 'Extreme thermal elevation (>88°C) and friction-induced oil vaporization',
                  severity: 'HIGH',
                  sources: ['technician_interview.mp3', 'inspection_video.mp4']
                },
                {
                  finding: 'Internal mechanical disintegration evidenced by bronze/steel flakes in filter mesh',
                  severity: 'CRITICAL',
                  sources: ['technician_notes.txt', 'damaged_machine.jpg']
                }
              ],
              cross_modal_connections: [
                {
                  insight: 'Vibration & Mechanical Deflection Triangulation',
                  explanation: 'Technician audio recording reports severe deck vibrations at 1800 RPM; inspection video corroborates lateral wobble exceeding 4.2mm with friction sparking, directly explaining why the fatigue fractures formed on the mounting bracket in the photograph.',
                  modalities: ['audio', 'video', 'image']
                },
                {
                  insight: 'Lubrication Breakdown Triangulation',
                  explanation: 'The machine photo shows scorched oil residue; technician notes confirm collapsed oiler pressure and bronze metal flakes; inspection video documents fluid vaporizing upon heat shield contact.',
                  modalities: ['image', 'text', 'video']
                }
              ],
              contradictions: [
                {
                  issue: 'Safety Status & Operational Certification Discrepancy',
                  sourceA: 'equipment_report.pdf (Certified normal, 1.2 mm/s vibration, 62°C temp, intact seals)',
                  sourceB: 'damaged_machine.jpg, technician_interview.mp3 & inspection_video.mp4 (4.2mm wobble, >88°C hotspot, cracked bracket, vaporizing oil)',
                  reconciliation: 'The written PDF inspection signed off on Oct 2 failed to reflect escalating subsurface fatigue prior to high-load operation on Oct 5, or was signed off prematurely without thermal load testing.'
                }
              ],
              risks: [
                'Total catastrophic bearing seizure during peak duty cycle leading to plant shutdown',
                'Friction sparking in presence of vaporized oil presents acute industrial fire hazard',
                'Catastrophic rotor fragmentation risk if turbine operated above 1800 RPM'
              ],
              recommendations: [
                'Immediate Lock-Out / Tag-Out (LOTO) enforcement on Turbine Unit 4B breakers',
                'Full disassembly and magnetic particle / ultrasonic non-destructive testing of the rotor shaft',
                'Complete overhaul of lower bearing bracket and recalibration of coupling alignment',
                'Internal audit of maintenance QA sign-offs regarding the Oct 2 inspection report'
              ],
              sources: [
                { name: 'equipment_report.pdf', type: 'pdf', status: 'contradicted' },
                { name: 'damaged_machine.jpg', type: 'image', status: 'corroborated' },
                { name: 'technician_interview.mp3', type: 'audio', status: 'corroborated' },
                { name: 'inspection_video.mp4', type: 'video', status: 'corroborated' },
                { name: 'technician_notes.txt', type: 'text', status: 'corroborated' }
              ]
            }
          ]);
        }

        // 5. Populate Conversation and Messages
        const { data: existingConvs } = await supabase
          .from('conversations')
          .select('id')
          .eq('project_id', projectId);

        let convId = existingConvs?.[0]?.id;
        if (!convId) {
          convId = uuidv4();
          await supabase.from('conversations').insert({
            id: convId,
            project_id: projectId,
            user_id: userId,
            title: 'Turbine 4B Cross-Modal Forensic Investigation'
          });

          await supabase.from('messages').insert([
            {
              id: uuidv4(),
              conversation_id: convId,
              user_id: userId,
              role: 'user',
              content: 'Analyze all uploaded evidence and identify the most serious issue.',
              sources: []
            },
            {
              id: uuidv4(),
              conversation_id: convId,
              user_id: userId,
              role: 'assistant',
              content: 'Based on cross-modal synthesis across the 5 project sources, the most critical issue is **impending catastrophic bearing seizure and rotor shaft failure** driven by severe shaft deflection and thermal overheating.\n\n### Direct Evidence Triangulation:\n1. **`damaged_machine.jpg`** reveals structural hairline fatigue fractures across the lower mounting bracket and dark scorched oil residue.\n2. **`technician_interview.mp3`** highlights audible rhythmic grinding at 1800 RPM, deck vibrations, and a hotspot temperature over 88°C.\n3. **`inspection_video.mp4`** captures 4.2mm lateral wobble and friction sparking under load.\n4. **`technician_notes.txt`** confirms bronze/steel particulates circulating in the lubrication filter basket.',
              sources: [
                { name: 'damaged_machine.jpg', type: 'image' },
                { name: 'technician_interview.mp3', type: 'audio' },
                { name: 'inspection_video.mp4', type: 'video' },
                { name: 'technician_notes.txt', type: 'text' }
              ]
            }
          ]);
        }

        return res.json({ success: true, data: proj, message: 'Factory Equipment Inspection demo seeded successfully.' });
      } else {
        // Local memory fallback
        let proj = memoryStore.projects.find(p => p.id === memoryStore.demoProjectId);
        if (!proj) {
          proj = {
            id: memoryStore.demoProjectId,
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

        return res.json({ success: true, data: proj, message: 'Factory Equipment Inspection demo seeded successfully.' });
      }
    } catch (err) {
      logger.error('Error seeding demo project:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Could not load demo project: ' + err.message,
        errorCode: 'SEED_DEMO_FAILED'
      });
    }
  }
};

export default projectController;
