import * as scenarioService from '../services/scenario.service.js';

/**
 * Generate test scenarios controller
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const generateScenarios = async (req, res) => {
  try {
    const featureData = req.body;
    const aiProvider = req.headers['x-ai-provider'] || 'openai';

    const result = await scenarioService.generateScenarios(featureData, aiProvider);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

/**
 * Get all scenarios or specific scenario by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getScenarios = async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      const scenario = scenarioService.getScenarioById(id);

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

    const db = scenarioService.getAllScenarios();

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
};
