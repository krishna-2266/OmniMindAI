# OmniMind AI 🧠

> **"Understand Everything. Across Every Format."**  
> *The Multimodal Evidence Intelligence Platform built for the Multimodal AI Hackathon.*

[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933.svg?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?style=flat&logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth%20%7C%20Storage-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-Multimodal%20Flash-4285F4.svg?style=flat&logo=google)](https://ai.google.dev/)

---

## 1. Problem Statement

In real-world incidents, forensic investigations, and engineering operations, critical evidence never arrives in a single format:
* A certified PDF report states: *"Equipment Status: NORMAL. Vibration: 1.2 mm/s."*
* A machine photo shows visible hairline fatigue fractures and dark scorched oil residue.
* An acoustic audio recording captures a field technician warning: *"Severe rhythmic grinding at 1800 RPM and intense deck vibrations."*
* A temporal inspection video captures rotational wobble with lateral deflection exceeding 4.2mm with sparks.
* A technician's emergency note reports bronze flakes circulating in the lubrication filter.

**The existing failure mode:** Conventional chatbots and isolated tools analyze each file in silos. They cannot reconcile contradictions, triangulate physical anomalies, or provide traceable evidence across formats.

---

## 2. Our Solution & Core Innovation

**OmniMind AI** introduces **Cross-Modal Evidence Reasoning**:
Instead of treating files as independent prompts, OmniMind ingests disparate media into a **Normalized Evidence Layer**, triangulates physical phenomena across sensory formats, identifies conflicting claims, and produces structured, actionable intelligence with verifiable source attribution.

```text
PDF Reports ─────┐
Images / Photos ─┼─► Unified Evidence Layer ─► Multimodal AI Reasoning ─┬─► Executive Summary
Audio Recs ──────┤     { sourceId, fileName,       (Google Gemini)       ├─► Key Findings
Video Timelines ─┤       modality, content,                              ├─► Contradictions Detected
Field Notes ─────┘       metadata }                                      ├─► Cross-Modal Connections
                                                                         ├─► Operational Risks
                                                                         └─► Actionable Next Steps
```

---

## 3. System Architecture

```text
                         USER / BROWSER
                               │
                               ▼
                    ┌──────────────────────┐
                    │  React 19 + Vite     │
                    │  Tailwind CSS v4     │
                    │  Deployed to VERCEL  │
                    └──────────┬───────────┘
                               │ HTTPS / REST
                               │ (Bearer Token / Signed URLs)
                               ▼
                    ┌──────────────────────┐
                    │  Node.js + Express   │
                    │  Zod + Multer + CORS │
                    │  Deployed to RENDER  │
                    └──────────┬───────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
    │   Supabase    │  │ Google Gemini │  │ Processing    │
    │  PostgreSQL   │  │ Multimodal AI │  │ Services      │
    │  Auth & RLS   │  │ (Flash Model) │  │ pdf-parse     │
    │  Priv.Storage │  │ Backend Only  │  │ Audio / Video │
    └───────────────┘  └───────────────┘  └───────────────┘
```

> **Security Guarantee:** `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` reside exclusively on the Express backend. The client browser never interacts directly with Gemini or sensitive database credentials.

---

## 4. Key Features

1. **Normalized Evidence Layer**: Standardized internal representation across Documents, Photographs, Audio logs, Video timelines, and Field Notes.
2. **Cross-Modal Contradiction Detection**: Flags when official documentation disagrees with perceptual evidence (e.g. PDF report claiming normal operation while photo & audio demonstrate catastrophic degradation).
3. **Multi-Modal Triangulation**: Automatically connects audio acoustic anomalies to video frame wobbles, physical damage photos, and filter particulates.
4. **Contextual Multimodal Chat**: Conversational interface with citation chips for every piece of evidence referenced.
5. **Private Supabase Storage**: Ephemeral signed download URLs prevent unauthorized file exposure.
6. **Zero-Friction Hackathon Demo Mode**: Ready out-of-the-box with preloaded **Factory Equipment Inspection - Turbine 4B** dataset.

---

## 5. Technology Stack

| Layer | Technologies | Deployment Target |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router 7, Axios, Lucide React | **Vercel** |
| **Backend** | Node.js 24, Express, Multer, Zod, pdf-parse, Helmet, CORS, Rate-Limiting | **Render** |
| **Database** | Supabase PostgreSQL with Row Level Security (RLS) policies | **Supabase** |
| **Authentication** | Supabase Auth (JWT bearer token validation) | **Supabase** |
| **File Storage** | Supabase Storage (`project-files` private bucket with signed URLs) | **Supabase** |
| **Multimodal AI** | Google Gemini API (`gemini-2.5-flash` via `@google/genai`) | Cloud (Backend only) |

---

## 6. Repository Structure

```text
omnimind-ai/
├── client/                     # Frontend SPA (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, FileUploader, FileCard, InsightCard, Chat
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── lib/                # api.js (Axios), supabase.js
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, Dashboard, Workspace
│   │   │   └── tabs/           # OverviewTab, SourcesTab, InsightsTab, ChatTab, SettingsTab
│   │   ├── App.jsx             # React Router route tree & protected routes
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind CSS v4 directives
│   ├── vercel.json             # Vercel SPA rewrite rules
│   └── vite.config.js          # Vite config with API reverse proxy
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # env.js, supabase.js, gemini.js
│   │   ├── controllers/        # auth, projects, files, notes, analysis, chat
│   │   ├── middleware/         # auth (JWT check), upload (Multer), rateLimiter, errorHandler
│   │   ├── routes/             # REST route endpoints
│   │   ├── services/
│   │   │   ├── ai/             # geminiService, crossModalAnalysisService, chatService
│   │   │   ├── processing/     # pdfService, imageService, audioService, videoService
│   │   │   └── storage/        # storageService (Supabase Storage + signed URLs)
│   │   ├── lib/                # memoryStore (in-memory demo database)
│   │   ├── validators/         # Zod schemas (insightSchema.js)
│   │   ├── app.js              # Express app definition
│   │   └── server.js           # Server listen & graceful shutdown
│   ├── demo_files/             # Sample PDF, image, audio transcript, video timeline files
│   └── test_e2e.js             # Automated end-to-end integration test runner
│
├── supabase/
│   ├── migrations/
│   │   └── 20250101000000_initial_schema.sql  # Complete schema, RLS policies & triggers
│   └── seed.sql                # Factory Equipment Inspection demo dataset
│
├── render.yaml                 # Render backend deployment spec
├── .env.example                # Unified environment variable documentation
└── package.json                # Root package with concurrently dev scripts
```

---

## 7. Quickstart / Local Development

### Prerequisites
* **Node.js**: v18.0.0 or later (v24.x recommended)
* **npm**: v9.0.0 or later

### Installation

Clone the repository and install all dependencies:
```bash
# In the root repository directory
npm run install:all
```
*(Or manually run `npm install` inside both `server/` and `client/`)*

### Run Both Client & Server Concurrently
```bash
npm run dev
```

* **Frontend Application**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)
* **API Healthcheck**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 8. Environment Variables

### Backend Configuration (`server/.env`)
Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Supabase Credentials (from Supabase Project Settings -> API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_STORAGE_BUCKET=project-files

# Google Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Force local fallback demo mode (optional)
DEMO_MODE=false
```

### Frontend Configuration (`client/.env`)
Create `client/.env` based on `client/.env.example`:
```env
# Leave empty in local dev to use Vite proxy, or set Render backend URL for production
VITE_API_URL=

# Supabase Client Credentials (from Supabase Project Settings -> API)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 9. Supabase Database & Storage Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase Dashboard, open the **SQL Editor**.
3. Copy and run the entire SQL migration script from:
   [`supabase/migrations/20250101000000_initial_schema.sql`](file:///c:/Users/Krishna/OneDrive/Desktop/multimodel/supabase/migrations/20250101000000_initial_schema.sql)
4. This script automatically:
   * Creates tables: `profiles`, `projects`, `files`, `notes`, `conversations`, `messages`, `ai_insights`.
   * Enables Row Level Security (RLS) on all tables with user-isolation policies (`auth.uid() = user_id`).
   * Configures `updated_at` triggers and user onboarding profile creation hooks.
   * Sets up the private `project-files` storage bucket and storage RLS policies.
5. (Optional) Run [`supabase/seed.sql`](file:///c:/Users/Krishna/OneDrive/Desktop/multimodel/supabase/seed.sql) to populate the demo turbine inspection project.

---

## 10. Automated Testing

Run the automated integration test suite to verify all endpoints, database interactions, Gemini schema validation, and multimodal chat:

```bash
cd server
node test_e2e.js
```

**Expected output:**
```text
===============================================================
🧪 OMNIMIND AI — AUTOMATED END-TO-END SYSTEM VERIFICATION
===============================================================
✅ [PASS] Healthcheck Endpoint (/api/health)
✅ [PASS] Authentication Verification (/api/auth/me)
✅ [PASS] Projects Fetching (/api/projects)
✅ [PASS] Project Detail Retrieval (/api/projects/:id)
✅ [PASS] Unified Evidence Files Fetching (/api/projects/:id/files)
✅ [PASS] Cross-Modal Reasoning Engine (/api/projects/:id/analyze)
✅ [PASS] Multimodal Chat with Source Citations (/api/projects/:id/chat)
===============================================================
🎉 VERIFICATION COMPLETE: 7/7 Tests Passed.
===============================================================
```

---

## 11. Hackathon 3-Minute Demo Walkthrough Script

Follow these steps for an optimal live evaluation presentation:

1. **Step 1 — Landing Page (`/`)**:
   * Highlight the core tagline: *"Understand Everything. Across Every Format."*
   * Explain: *"Most AI tools inspect files individually. OmniMind connects evidence across text, documents, photos, audio, and video."*
   * Click **"Launch Live Hackathon Demo"** (instantly signs in with 1 click).

2. **Step 2 — Dashboard (`/dashboard`)**:
   * Shows analytics: total workspaces, indexed multi-modal files, and AI syntheses generated.
   * Open the pre-loaded **"Factory Equipment Inspection - Turbine 4B"** workspace.

3. **Step 3 — Sources Tab (`/projects/:id/files`)**:
   * Show the 5 diverse modalities in the evidence ledger:
     * `equipment_report.pdf` (PDF inspection report)
     * `damaged_machine.jpg` (Photograph showing fatigue fractures)
     * `technician_interview.mp3` (Audio log warning of 1800 RPM vibration & 88°C heat)
     * `inspection_video.mp4` (Video footage capturing 4.2mm shaft wobble and sparking)
     * `technician_notes.txt` (Shift note citing bronze flakes in filter mesh)
   * Click **"Inspect Extracted Evidence"** on `damaged_machine.jpg` to display the extracted perceptual features.

4. **Step 4 — AI Insights Tab (`/projects/:id/insights`)**:
   * Click **"Execute Cross-Modal Reasoning"**.
   * Demonstrate the **Contradiction Detector**:
     * *Source Claim A*: `equipment_report.pdf` certifies normal operation (1.2 mm/s vibration).
     * *Conflicting Empirical Evidence B*: `damaged_machine.jpg`, `technician_interview.mp3`, and `inspection_video.mp4` reveal severe fatigue fractures, 4.2mm lateral deflection, and >88°C hotspot.
   * Show the **Cross-Modal Connections** and **Actionable Recommendations** (Immediate LOTO, non-destructive ultrasonic testing, flange replacement).

5. **Step 5 — Multimodal Chat Tab (`/projects/:id/chat`)**:
   * Click the reasoning prompt: *"Are there contradictions between the sources?"*
   * The AI answers with evidence citations, linking directly back to `equipment_report.pdf` and `inspection_video.mp4`.
   * Click on any source chip to review the raw evidence.

---

## 12. Security Architecture

* **Row Level Security (RLS)**: Enforced directly on Supabase PostgreSQL. A user cannot query another user's project by tampering with UUID parameters.
* **Storage Isolation**: Uploaded evidence is stored in private Supabase buckets. Only ephemeral signed URLs (valid 1 hour) are issued for authorized inspection.
* **Backend Token Verification**: Express middleware validates Supabase JWT access tokens on every incoming request.
* **Secret Protection**: `GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are never bundled into Vite or exposed to browser bundles.
* **Input Validation**: All AI outputs and project payloads are strictly parsed and validated using **Zod**.

---

## 13. Deployment Guide

### Deploying Backend to Render
1. Create a **New Web Service** connected to your repository on [render.com](https://render.com).
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add the Environment Variables:
   * `NODE_ENV`: `production`
   * `CLIENT_URL`: `https://your-frontend-app.vercel.app`
   * `SUPABASE_URL`: `https://your-project.supabase.co`
   * `SUPABASE_SERVICE_ROLE_KEY`: `your_supabase_service_role_key`
   * `GEMINI_API_KEY`: `your_gemini_api_key`
   * `GEMINI_MODEL`: `gemini-2.5-flash`

### Deploying Frontend to Vercel
1. Import the repository on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Framework Preset: `Vite`.
4. Add the Environment Variables:
   * `VITE_API_URL`: `https://your-render-backend.onrender.com`
   * `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   * `VITE_SUPABASE_ANON_KEY`: `your_supabase_anon_key`
5. Deploy. `client/vercel.json` ensures all SPA routes resolve correctly.

---

## 14. License
MIT License. Built with passion for the Multimodal AI Hackathon 2025.
