import { v4 as uuidv4 } from 'uuid';

/**
 * High-performance in-memory database store for local dev / offline demo mode.
 * Preloaded with the Factory Equipment Inspection demo dataset.
 */
class MemoryStore {
  constructor() {
    this.demoUserId = 'a0000000-0000-0000-0000-000000000001';
    this.demoProjectId = 'p0000000-0000-0000-0000-000000000001';
    this.demoConvId = 'c0000000-0000-0000-0000-000000000001';

    this.profiles = [
      {
        id: this.demoUserId,
        email: 'demo@omnimind.ai',
        full_name: 'Lead Multimodal Investigator',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        created_at: new Date().toISOString()
      }
    ];

    this.projects = [
      {
        id: this.demoProjectId,
        user_id: this.demoUserId,
        name: 'Factory Equipment Inspection - Turbine 4B',
        description: 'Cross-modal forensic analysis of Turbine Unit 4B following reported anomalous vibrations and maintenance discrepancies.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    this.files = [
      {
        id: uuidv4(),
        project_id: this.demoProjectId,
        user_id: this.demoUserId,
        original_name: 'equipment_report.pdf',
        storage_path: `${this.demoUserId}/${this.demoProjectId}/equipment_report.pdf`,
        mime_type: 'application/pdf',
        file_size: 245800,
        modality: 'pdf',
        processing_status: 'ready',
        extracted_text: 'TURBINE UNIT 4B ROUTINE INSPECTION REPORT\nDate: Oct 02, 2024\nInspector: Chief Tech R. Vance\nStatus: OPERATIONAL - NORMAL\nBearing Temperatures: 62°C (Acceptable tolerance < 70°C)\nRotor Shaft Vibration: 1.2 mm/s (Acceptable threshold < 2.5 mm/s)\nHydraulic Seals: Verified intact, zero visible leaks.\nLubrication Pressure: Constant at 45 PSI.\nConclusion: Equipment certified for continuous uninhibited operation through Q4.',
        ai_summary: 'Routine inspection report claiming Turbine Unit 4B is in normal condition with 1.2 mm/s vibration and intact seals.',
        metadata: { pages: 3, author: 'Chief Tech R. Vance', signoffDate: '2024-10-02' },
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: uuidv4(),
        project_id: this.demoProjectId,
        user_id: this.demoUserId,
        original_name: 'damaged_machine.jpg',
        storage_path: `${this.demoUserId}/${this.demoProjectId}/damaged_machine.jpg`,
        mime_type: 'image/jpeg',
        file_size: 1840000,
        modality: 'image',
        processing_status: 'ready',
        extracted_text: '[Visual Analysis] Visual inspection of Turbine Unit 4B lower bearing housing and drive shaft coupling flange.',
        ai_summary: 'High-resolution photograph reveals severe hairline fatigue cracking across the lower bearing bracket flange, accompanied by dark scorched oil residue and accumulated metallic micro-shavings around the seal circumference. Drive shaft coupling is visibly skewed 3-4° off-axis.',
        metadata: { resolution: '3840x2160', detectedAnomalies: ['hairline_fractures', 'scorched_oil', 'metal_shavings', 'misalignment'] },
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: uuidv4(),
        project_id: this.demoProjectId,
        user_id: this.demoUserId,
        original_name: 'technician_interview.mp3',
        storage_path: `${this.demoUserId}/${this.demoProjectId}/technician_interview.mp3`,
        mime_type: 'audio/mpeg',
        file_size: 3450000,
        modality: 'audio',
        processing_status: 'ready',
        extracted_text: 'TRANSCRIPT - Senior Tech Dave Miller (Oct 05, 2024, 08:30 AM):\n"We ran Unit 4B under 80% load yesterday afternoon and immediately felt a heavy rhythmic grinding kicking in right at 1800 RPM. Control room SCADA showed green metrics, but you could physically feel the entire metal mezzanine shaking under your boots. That lower housing is running way hotter than the 62 degrees in Vance\'s paper—I clocked it over 88°C on my thermal spotter. If they run this during peak tomorrow, that shaft will seize solid."',
        ai_summary: 'Technician audio interview warning of severe rhythmic grinding at 1800 RPM, deck vibrations, thermal hotspot exceeding 88°C, and warning of catastrophic shaft seizure.',
        metadata: { durationSeconds: 142, speaker: 'Dave Miller', sentiment: 'urgent_warning' },
        created_at: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: uuidv4(),
        project_id: this.demoProjectId,
        user_id: this.demoUserId,
        original_name: 'inspection_video.mp4',
        storage_path: `${this.demoUserId}/${this.demoProjectId}/inspection_video.mp4`,
        mime_type: 'video/mp4',
        file_size: 12400000,
        modality: 'video',
        processing_status: 'ready',
        extracted_text: '[Video Frame Timeline Analysis]:\n00:00-00:08: RPM spin-up sequence.\n00:09-00:15: Distinct lateral wobble observable on driveshaft coupling with intermittent electrical/friction sparks.\n00:16-00:24: Dark fluid seepage spraying beneath bearing housing, vaporizing upon thermal contact.\n00:25-00:30: Lateral deflection exceeds 4.2mm, matching technician report of deck vibration.',
        ai_summary: 'High-frame-rate video analysis confirms severe shaft wobble (>4.2mm lateral deflection), intermittent friction sparking, and fluid vaporization under thermal load.',
        metadata: { durationSeconds: 30, fps: 60, keyEvents: ['lateral_wobble', 'friction_sparking', 'fluid_vaporization'] },
        created_at: new Date(Date.now() - 21600000).toISOString()
      }
    ];

    this.notes = [
      {
        id: uuidv4(),
        project_id: this.demoProjectId,
        user_id: this.demoUserId,
        content: 'EMERGENCY SHIFT NOTE (Oct 06, 2024 - D. Miller):\nBypassed automated oiler because line pressure collapsed. Disassembled secondary filter basket and discovered extensive bronze/steel flakes trapped in the mesh. Tagged turbine breaker with preliminary warning. Do NOT remove lock without ultrasonic non-destructive testing of rotor core.',
        created_at: new Date(Date.now() - 10800000).toISOString()
      }
    ];

    this.ai_insights = [
      {
        id: uuidv4(),
        project_id: this.demoProjectId,
        user_id: this.demoUserId,
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
        ],
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    this.conversations = [
      {
        id: this.demoConvId,
        project_id: this.demoProjectId,
        user_id: this.demoUserId,
        title: 'Turbine 4B Cross-Modal Forensic Investigation',
        created_at: new Date().toISOString()
      }
    ];

    this.messages = [
      {
        id: uuidv4(),
        conversation_id: this.demoConvId,
        user_id: this.demoUserId,
        role: 'user',
        content: 'Analyze all uploaded evidence and identify the most serious issue.',
        sources: [],
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: uuidv4(),
        conversation_id: this.demoConvId,
        user_id: this.demoUserId,
        role: 'assistant',
        content: 'Based on cross-modal synthesis across the 5 project sources, the most critical issue is **impending catastrophic bearing seizure and rotor shaft failure** driven by severe shaft deflection and thermal overheating.\n\n### Direct Evidence Triangulation:\n1. **`damaged_machine.jpg`** reveals structural hairline fatigue fractures across the lower mounting bracket and dark scorched oil residue.\n2. **`technician_interview.mp3`** highlights audible rhythmic grinding at 1800 RPM, deck vibrations, and a hotspot temperature over 88°C.\n3. **`inspection_video.mp4`** captures 4.2mm lateral wobble and friction sparking under load.\n4. **`technician_notes.txt`** confirms bronze/steel particulates circulating in the lubrication filter basket.',
        sources: [
          { name: 'damaged_machine.jpg', type: 'image' },
          { name: 'technician_interview.mp3', type: 'audio' },
          { name: 'inspection_video.mp4', type: 'video' },
          { name: 'technician_notes.txt', type: 'text' }
        ],
        created_at: new Date(Date.now() - 3500000).toISOString()
      }
    ];
  }
}

export const memoryStore = new MemoryStore();
export default memoryStore;

