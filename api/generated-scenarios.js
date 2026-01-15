import { getAllScenarios, getScenarioById } from '../src/database/scenario-db.js';

export default async function handler(req, res) {
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

  try {
    const { id } = req.query;

    // Se um ID foi fornecido, retorna apenas esse cenário
    if (id) {
      const scenario = getScenarioById(id);

      if (!scenario) {
        return res.status(404).json({
          success: false,
          error: 'Scenario not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: scenario,
      });
    }

    // Caso contrário, retorna todos os cenários
    const db = getAllScenarios();

    return res.status(200).json({
      success: true,
      total: db.scenarios.length,
      data: db.scenarios,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
