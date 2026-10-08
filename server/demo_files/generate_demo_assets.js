import fs from 'fs';
import path from 'path';

const demoDir = path.resolve(process.cwd(), 'demo_files');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
}

// 1. Text Note
const notesContent = `EMERGENCY SHIFT NOTE (Oct 06, 2024 - D. Miller):
Bypassed automated oiler because line pressure collapsed. Disassembled secondary filter basket and discovered extensive bronze/steel flakes trapped in the mesh. Tagged turbine breaker with preliminary warning. Do NOT remove lock without ultrasonic non-destructive testing of rotor core.`;
fs.writeFileSync(path.join(demoDir, 'technician_notes.txt'), notesContent);

// 2. Audio Transcript
const audioTranscript = `FIELD INTERVIEW RECORDING - AUDIO LOG
Speaker: Dave Miller (Senior Field Reliability Engineer)
Timestamp: Oct 05, 2024 - 08:30 AM
Subject: Turbine Unit 4B Operational Anomaly

"We ran Unit 4B under 80% load yesterday afternoon and immediately felt a heavy rhythmic grinding kicking in right at 1800 RPM. Control room SCADA showed green metrics, but you could physically feel the entire metal mezzanine shaking under your boots. That lower housing is running way hotter than the 62 degrees in Vance's paper—I clocked it over 88°C on my thermal spotter. If they run this during peak tomorrow, that shaft will seize solid."`;
fs.writeFileSync(path.join(demoDir, 'technician_interview_transcript.txt'), audioTranscript);

// 3. Minimal Valid PDF
const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 270 >>
stream
BT
/F1 14 Tf
50 720 Td
(TURBINE UNIT 4B ROUTINE INSPECTION REPORT) Tj
/F1 10 Tf
0 -30 Td
(Date: Oct 02, 2024 | Inspector: Chief Tech R. Vance) Tj
0 -20 Td
(Status: OPERATIONAL - NORMAL) Tj
0 -20 Td
(Bearing Temperature: 62 C - WITHIN 70 C TOLERANCE) Tj
0 -20 Td
(Rotor Shaft Vibration: 1.2 mm/s - NORMAL THRESHOLD) Tj
0 -20 Td
(Hydraulic Seals: Verified intact, zero visible leaks) Tj
0 -20 Td
(Conclusion: Equipment certified for continuous duty through Q4.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000547 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
628
%%EOF`;
fs.writeFileSync(path.join(demoDir, 'equipment_report.pdf'), pdfContent);

// 4. Sample SVG Image of damaged bearing
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="100%" height="100%" fill="#1a1f2c"/>
  <circle cx="400" cy="300" r="180" fill="#2d3748" stroke="#cbd5e1" stroke-width="12"/>
  <circle cx="400" cy="300" r="100" fill="#0f172a" stroke="#ef4444" stroke-width="6" stroke-dasharray="8 4"/>
  <!-- Hairline Fractures -->
  <path d="M 320 220 L 370 270 L 350 310 L 400 350 L 430 400" stroke="#f87171" stroke-width="4" fill="none"/>
  <path d="M 460 210 L 440 260 L 470 290" stroke="#f87171" stroke-width="3" fill="none"/>
  <!-- Scorched Oil Zone -->
  <ellipse cx="440" cy="360" rx="45" ry="25" fill="#78350f" opacity="0.8"/>
  <text x="400" y="80" font-family="sans-serif" font-size="24" fill="#f8fafc" text-anchor="middle" font-weight="bold">FORENSIC EVIDENCE: TURBINE 4B LOWER BEARING HOUSING</text>
  <text x="400" y="115" font-family="sans-serif" font-size="16" fill="#ef4444" text-anchor="middle">Detected: Hairline Fatigue Cracks &amp; Scorched Thermal Residue</text>
  <text x="400" y="540" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Shaft Alignment Skew: 3.4° Off-Axis | Scorched Lubricant Spill</text>
</svg>`;
fs.writeFileSync(path.join(demoDir, 'damaged_machine.svg'), svgContent);

console.log('Demo assets generated successfully in server/demo_files/');

