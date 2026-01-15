import { QAAgent } from '../agents/qa-agent.js';
import * as scenarioRepository from '../repositories/scenario.repository.js';

/**
 * Generate test scenarios for a feature
 * @param {Object} featureData - Feature data
 * @param {string} provider - AI provider (openai, github, anthropic)
 * @returns {Promise<Object>} Generated scenarios result
 */
export const generateScenarios = async (featureData, provider = 'openai') => {
  const qaAgent = new QAAgent(provider);
  const result = await qaAgent.generateTestScenarios(featureData);

  if (!result.success) {
    return result;
  }

  // Save to database
  try {
    const savedEntry = scenarioRepository.create(featureData, result.data, provider);
    result.id = savedEntry.id;
    console.log(`✅ Cenário salvo no banco de dados com ID: ${savedEntry.id}`);
  } catch (dbError) {
    console.error('⚠️ Erro ao salvar no banco de dados:', dbError.message);
    throw new Error(`Failed to save scenario: ${dbError.message}`);
  }

  return result;
};

/**
 * Get all generated scenarios
 * @returns {Object} All scenarios
 */
export const getAllScenarios = () => {
  return scenarioRepository.findAll();
};

/**
 * Get scenario by ID
 * @param {string} id - Scenario ID
 * @returns {Object|undefined} Scenario or undefined
 */
export const getScenarioById = id => {
  return scenarioRepository.findById(id);
};

/**
 * Delete scenario by ID
 * @param {string} id - Scenario ID
 * @returns {boolean|null} True if deleted, null if not found
 */
export const deleteScenarioById = id => {
  return scenarioRepository.deleteById(id);
};
