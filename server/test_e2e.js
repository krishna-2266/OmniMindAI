import http from 'http';
import app from './src/app.js';
import memoryStore from './src/lib/memoryStore.js';

async function runEndToEndVerification() {
  console.log('===============================================================');
  console.log('🧪 OMNIMIND AI — AUTOMATED END-TO-END SYSTEM VERIFICATION');
  console.log('===============================================================');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  const baseUrl = 'http://localhost:5099';

  let passedTests = 0;
  let totalTests = 0;

  async function test(name, fn) {
    totalTests++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
    }
  }

  try {
    // 1. Healthcheck
    await test('Healthcheck Endpoint (/api/health)', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      const data = await res.json();
      if (data.status !== 'online') throw new Error(`Status not online: ${data.status}`);
      if (!data.services) throw new Error('Missing services health status');
    });

    // 2. Auth Profile
    await test('Authentication Verification (/api/auth/me)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { 'Authorization': 'Bearer demo-token' }
      });
      const data = await res.json();
      if (!data.success) throw new Error(`Auth failed: ${data.message}`);
      if (!data.data.email) throw new Error('User profile missing email');
    });

    // 3. Projects Listing
    await test('Projects Fetching (/api/projects)', async () => {
      const res = await fetch(`${baseUrl}/api/projects`, {
        headers: { 'Authorization': 'Bearer demo-token' }
      });
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data)) throw new Error('Failed to retrieve projects');
      if (data.data.length === 0) throw new Error('Preloaded demo project not found');
    });

    // 4. Project Details
    const projectId = memoryStore.demoProjectId;
    await test('Project Detail Retrieval (/api/projects/:id)', async () => {
      const res = await fetch(`${baseUrl}/api/projects/${projectId}`, {
        headers: { 'Authorization': 'Bearer demo-token' }
      });
      const data = await res.json();
      if (!data.success || data.data.id !== projectId) throw new Error('Could not get project');
    });

    // 5. Evidence Files Retrieval
    await test('Unified Evidence Files Fetching (/api/projects/:id/files)', async () => {
      const res = await fetch(`${baseUrl}/api/projects/${projectId}/files`, {
        headers: { 'Authorization': 'Bearer demo-token' }
      });
      const data = await res.json();
      if (!data.success || data.data.length < 3) throw new Error('Expected at least 3 preloaded evidence files');
      const modalities = data.data.map(f => f.modality);
      if (!modalities.includes('pdf') || !modalities.includes('image') || !modalities.includes('audio')) {
        throw new Error(`Incomplete modality representation: ${modalities.join(', ')}`);
      }
    });

    // 6. Cross-Modal Evidence Reasoning Execution
    await test('Cross-Modal Reasoning Engine (/api/projects/:id/analyze)', async () => {
      const res = await fetch(`${baseUrl}/api/projects/${projectId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify({ focusQuery: 'impending failure' })
      });
      const json = await res.json();
      if (!json.success) throw new Error(`Reasoning failed: ${json.message}`);
      const insight = json.data;
      if (!insight.summary) throw new Error('Missing executive summary');
      if (!Array.isArray(insight.key_findings) || insight.key_findings.length === 0) {
        throw new Error('Missing key findings');
      }
      if (!Array.isArray(insight.cross_modal_connections) || insight.cross_modal_connections.length === 0) {
        throw new Error('Missing cross-modal connections');
      }
      if (!Array.isArray(insight.contradictions) || insight.contradictions.length === 0) {
        throw new Error('Missing contradiction detection');
      }
      if (!Array.isArray(insight.recommendations) || insight.recommendations.length === 0) {
        throw new Error('Missing actionable recommendations');
      }
    });

    // 7. Multimodal Conversational Reasoning
    await test('Multimodal Chat with Source Citations (/api/projects/:id/chat)', async () => {
      const res = await fetch(`${baseUrl}/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify({ message: 'Are there contradictions between the sources?' })
      });
      const json = await res.json();
      if (!json.success) throw new Error(`Chat failed: ${json.message}`);
      const assistantMessage = json.data.assistantMessage;
      if (!assistantMessage.content) throw new Error('Missing assistant answer');
      if (!Array.isArray(assistantMessage.sources) || assistantMessage.sources.length === 0) {
        throw new Error('Missing source citations in answer');
      }
    });

    console.log('===============================================================');
    console.log(`🎉 VERIFICATION COMPLETE: ${passedTests}/${totalTests} Tests Passed.`);
    console.log('===============================================================');

  } finally {
    server.close();
  }
}

runEndToEndVerification().catch((err) => {
  console.error('Test suite encountered unexpected fatal error:', err);
  process.exit(1);
});

