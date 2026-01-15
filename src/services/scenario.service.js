import { QAAgent } from '../agents/qa-agent.js';
import * as scenarioRepository from '../repositories/scenario.repository.js';
import path from 'path';
import { generateFeatureFilename } from '../utils/sanitize.utils.js';
import { saveJsonFile } from '../utils/file.utils.js';

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
  let savedEntry = null;
  try {
    savedEntry = scenarioRepository.create(featureData, result.data, provider);
    console.log(`✅ Cenário salvo no banco de dados com ID: ${savedEntry.id}`);
  } catch (dbError) {
    console.error('⚠️ Erro ao salvar no banco de dados:', dbError.message);
  }

  // Save to file
  try {
    const resultsDir = path.join(process.cwd(), 'results');
    const fileName = generateFeatureFilename(featureData.name);
    const filePath = path.join(resultsDir, fileName);

    saveJsonFile(filePath, result);

    result.savedTo = fileName;
    if (savedEntry) {
      result.id = savedEntry.id;
    }

    console.log(`✅ Resultado salvo em: ${filePath}`);
  } catch (saveError) {
    console.error('⚠️ Erro ao salvar arquivo:', saveError.message);
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
