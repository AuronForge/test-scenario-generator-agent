/**
 * Health check endpoint
 * Returns API status and version information
 */
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'test-scenario-generator-agent',
    version: '1.0.0',
    apiVersion: 'v1',
    timestamp: new Date().toISOString(),
    endpoints: {
      generateScenarios: '/api/v1/generate-scenarios',
      generatedScenarios: '/api/v1/generated-scenarios',
      swagger: '/api/v1/swagger',
      docs: '/api/v1/docs',
    },
  });
}
