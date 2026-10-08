-- ==============================================================================
-- OMNIMIND AI — Seed Data: Factory Equipment Inspection
-- Demonstrates authentic Cross-Modal Evidence Reasoning
-- ==============================================================================

-- Note: Replace with a test user ID or execute after creating an initial user.
-- This seed provides standard reference data for testing and local database hydration.

DO $$
DECLARE
    demo_user_id UUID;
    demo_project_id UUID := 'a0000000-0000-0000-0000-000000000001'::uuid;
    demo_conv_id UUID := 'b0000000-0000-0000-0000-000000000001'::uuid;
BEGIN
    -- Select the first existing user in auth.users, or create a mock reference if in testing
    SELECT id INTO demo_user_id FROM auth.users LIMIT 1;

    IF demo_user_id IS NOT NULL THEN
        -- Insert Demo Project
        INSERT INTO public.projects (id, user_id, name, description)
        VALUES (
            demo_project_id,
            demo_user_id,
            'Factory Equipment Inspection - Turbine 4B',
            'Cross-modal forensic analysis of Turbine Unit 4B following reported anomalous vibrations and maintenance discrepancies.'
        )
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description;

        -- Source 1: PDF Report
        INSERT INTO public.files (
            project_id, user_id, original_name, storage_path, mime_type, file_size,
            modality, processing_status, extracted_text, ai_summary, metadata
        )
        VALUES (
            demo_project_id,
            demo_user_id,
            'equipment_report.pdf',
            demo_user_id || '/' || demo_project_id || '/equipment_report.pdf',
            'application/pdf',
            245800,
            'pdf',
            'ready',
            'TURBINE UNIT 4B ROUTINE INSPECTION REPORT\nDate: Oct 02, 2024\nInspector: Chief Tech R. Vance\nStatus: OPERATIONAL - NORMAL\nBearing Temperatures: 62°C (Acceptable tolerance < 70°C)\nRotor Shaft Vibration: 1.2 mm/s (Acceptable threshold < 2.5 mm/s)\nHydraulic Seals: Verified intact, zero visible leaks.\nLubrication Pressure: Constant at 45 PSI.\nConclusion: Equipment certified for uninhibited continuous operation through Q4.',
            'Routine inspection report claiming Turbine Unit 4B is in normal condition with 1.2 mm/s vibration and intact seals.',
            '{"pages": 3, "author": "Chief Tech R. Vance", "signoffDate": "2024-10-02"}'::jsonb
        );

        -- Source 2: Machine Photograph
        INSERT INTO public.files (
            project_id, user_id, original_name, storage_path, mime_type, file_size,
            modality, processing_status, extracted_text, ai_summary, metadata
        )
        VALUES (
            demo_project_id,
            demo_user_id,
            'damaged_machine.jpg',
            demo_user_id || '/' || demo_project_id || '/damaged_machine.jpg',
            'image/jpeg',
            1840000,
            'image',
            'ready',
            '[Visual Analysis] Visual inspection of Turbine Unit 4B lower bearing housing and drive shaft coupling flange.',
            'High-resolution imagery reveals severe hairline fatigue cracking across the lower bearing bracket flange, accompanied by dark scorched oil residue and accumulated metallic micro-shavings around the seal circumference. Drive shaft coupling is visibly skewed 3-4° off-axis.',
            '{"resolution": "3840x2160", "detectedAnomalies": ["hairline_fractures", "scorched_oil", "metal_shavings", "misalignment"]}'::jsonb
        );

        -- Source 3: Audio Interview
        INSERT INTO public.files (
            project_id, user_id, original_name, storage_path, mime_type, file_size,
            modality, processing_status, extracted_text, ai_summary, metadata
        )
        VALUES (
            demo_project_id,
            demo_user_id,
            'technician_interview.mp3',
            demo_user_id || '/' || demo_project_id || '/technician_interview.mp3',
            'audio/mpeg',
            3450000,
            'audio',
            'ready',
            'TRANSCRIPT - Senior Tech Dave Miller (Oct 05, 2024, 08:30 AM):\n"We ran Unit 4B under 80% load yesterday afternoon and immediately felt a heavy rhythmic grinding kicking in right at 1800 RPM. Control room SCADA showed green metrics, but you could physically feel the entire metal mezzanine shaking under your boots. That lower housing is running way hotter than the 62 degrees in Vance''s paper—I clocked it over 88°C on my thermal spotter. If they run this during peak tomorrow, that shaft will seize solid."',
            'Technician audio interview warning of severe rhythmic grinding at 1800 RPM, deck vibrations, thermal hotspot exceeding 88°C, and warning of catastrophic shaft seizure.',
            '{"durationSeconds": 142, "speaker": "Dave Miller", "sentiment": "urgent_warning"}'::jsonb
        );

        -- Source 4: Video Inspection
        INSERT INTO public.files (
            project_id, user_id, original_name, storage_path, mime_type, file_size,
            modality, processing_status, extracted_text, ai_summary, metadata
        )
        VALUES (
            demo_project_id,
            demo_user_id,
            'inspection_video.mp4',
            demo_user_id || '/' || demo_project_id || '/inspection_video.mp4',
            'video/mp4',
            12400000,
            'video',
            'ready',
            '[Video Frame Timeline Analysis]:\n00:00-00:08: RPM spin-up sequence.\n00:09-00:15: Distinct lateral wobble observable on driveshaft coupling with intermittent electrical/friction sparks.\n00:16-00:24: Dark fluid seepage spraying beneath bearing housing, vaporizing upon thermal contact.\n00:25-00:30: Lateral deflection exceeds 4.2mm, matching technician report of deck vibration.',
            'High-frame-rate video analysis confirms severe shaft wobble (>4.2mm lateral deflection), intermittent friction sparking, and fluid vaporization under thermal load.',
            '{"durationSeconds": 30, "fps": 60, "keyEvents": ["lateral_wobble", "friction_sparking", "fluid_vaporization"]}'::jsonb
        );

        -- Source 5: Technician Notes
        INSERT INTO public.notes (
            project_id, user_id, content
        )
        VALUES (
            demo_project_id,
            demo_user_id,
            'EMERGENCY SHIFT NOTE (Oct 06, 2024 - D. Miller):\nBypassed automated oiler because line pressure collapsed. Disassembled secondary filter basket and discovered extensive bronze/steel flakes trapped in the mesh. Tagged turbine breaker with preliminary warning. Do NOT remove lock without ultrasonic non-destructive testing of rotor core.'
        );

        -- AI Insights: Cross-Modal Evidence Reasoning Synthesis
        INSERT INTO public.ai_insights (
            project_id, user_id, summary, key_findings, cross_modal_connections, contradictions, risks, recommendations, sources
        )
        VALUES (
            demo_project_id,
            demo_user_id,
            'Cross-modal analysis reveals an impending catastrophic bearing seizure and rotor fatigue failure on Turbine Unit 4B. While the written PDF inspection certified the unit as normal with 1.2 mm/s vibration, physical photograph, high-speed video, technician audio, and shift notes collectively prove severe unmonitored structural disintegration, excessive 4.2mm shaft deflection, and thermal overheating.',
            '[
                {"finding": "Severe structural fatigue with hairline cracks and off-axis coupling tilt (3-4°)", "severity": "CRITICAL", "sources": ["damaged_machine.jpg", "inspection_video.mp4"]},
                {"finding": "Extreme thermal elevation (>88°C) and friction-induced oil vaporization", "severity": "HIGH", "sources": ["technician_interview.mp3", "inspection_video.mp4"]},
                {"finding": "Internal mechanical disintegration evidenced by bronze/steel flakes in filter mesh", "severity": "CRITICAL", "sources": ["technician_notes.txt", "damaged_machine.jpg"]}
            ]'::jsonb,
            '[
                {
                    "insight": "Vibration and Wobble Triangulation",
                    "explanation": "Technician Dave Miller reported heavy deck vibration in audio interview; inspection video confirms lateral deflection exceeding 4.2mm with friction sparking, directly explaining why the fatigue fractures formed on the mounting bracket in damaged_machine.jpg.",
                    "modalities": ["audio", "video", "image"]
                },
                {
                    "insight": "Lubrication Failure Confirmation",
                    "explanation": "Damaged machine photo shows scorched oil residue; technician notes confirm collapsed oiler pressure and bronze metal flakes; inspection video documents fluid vaporizing upon heat shield contact.",
                    "modalities": ["image", "text", "video"]
                }
            ]'::jsonb,
            '[
                {
                    "issue": "Safety Status & Operational Certification",
                    "sourceA": "equipment_report.pdf (Certified normal, 1.2 mm/s vibration, 62°C temp, intact seals)",
                    "sourceB": "damaged_machine.jpg, technician_interview.mp3 & inspection_video.mp4 (4.2mm wobble, >88°C hotspot, cracked bracket, vaporizing oil)",
                    "reconciliation": "The PDF inspection signed off on Oct 2 was either falsified or failed to detect rapidly escalating subsurface fatigue prior to high-load operation on Oct 5."
                }
            ]'::jsonb,
            '[
                "Total catastrophic bearing seizure during peak duty cycle leading to power outage",
                "Friction sparking in presence of vaporized oil presents acute industrial fire hazard",
                "Catastrophic rotor fragmentation risk if turbine operated above 1800 RPM"
            ]'::jsonb,
            '[
                "Immediate Lock-Out / Tag-Out (LOTO) enforcement on Turbine Unit 4B breakers",
                "Full disassembly and magnetic particle / ultrasonic non-destructive testing of the rotor shaft",
                "Complete overhaul of lower bearing bracket and recalibration of coupling alignment",
                "Internal audit of maintenance QA sign-offs regarding the Oct 2 inspection report"
            ]'::jsonb,
            '[
                {"name": "equipment_report.pdf", "type": "pdf", "status": "contradicted"},
                {"name": "damaged_machine.jpg", "type": "image", "status": "corroborated"},
                {"name": "technician_interview.mp3", "type": "audio", "status": "corroborated"},
                {"name": "inspection_video.mp4", "type": "video", "status": "corroborated"},
                {"name": "technician_notes.txt", "type": "text", "status": "corroborated"}
            ]'::jsonb
        );

        -- Conversation & Sample Messages
        INSERT INTO public.conversations (id, project_id, user_id, title)
        VALUES (demo_conv_id, demo_project_id, demo_user_id, 'Turbine 4B Cross-Modal Forensic Investigation')
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.messages (conversation_id, user_id, role, content, sources)
        VALUES
        (
            demo_conv_id,
            demo_user_id,
            'user',
            'Analyze all uploaded evidence and identify the most serious issue.',
            '[]'::jsonb
        ),
        (
            demo_conv_id,
            demo_user_id,
            'assistant',
            'Based on cross-modal synthesis across the 5 project sources, the most critical issue is **impending catastrophic bearing seizure and rotor shaft failure** driven by severe shaft deflection and thermal overheating.\n\n### Direct Evidence Triangulation:\n1. **`damaged_machine.jpg`** reveals structural hairline fatigue fractures across the lower mounting bracket and dark scorched oil residue.\n2. **`technician_interview.mp3`** highlights audible rhythmic grinding at 1800 RPM, deck vibrations, and a hotspot temperature over 88°C.\n3. **`inspection_video.mp4`** captures 4.2mm lateral wobble and friction sparking under load.\n4. **`technician_notes.txt`** confirms bronze/steel particulates circulating in the lubrication filter basket.',
            '[{"name": "damaged_machine.jpg", "type": "image"}, {"name": "technician_interview.mp3", "type": "audio"}, {"name": "inspection_video.mp4", "type": "video"}, {"name": "technician_notes.txt", "type": "text"}]'::jsonb
        );
    END IF;
END $$;

