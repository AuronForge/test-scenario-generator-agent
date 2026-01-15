import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ensureDirectoryExists,
  saveJsonFile,
  readJsonFile,
  fileExists,
} from '../utils/file.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DB_PATH = path.join(__dirname, '..', '..', 'database', 'scenarios.json');

/**
 * Ensure database exists
 * @param {string} dbPath - Custom database path (optional, for testing)
 */
const ensureDatabase = (dbPath = DB_PATH) => {
  const dbDir = path.dirname(dbPath);
  ensureDirectoryExists(dbDir);

  if (!fileExists(dbPath)) {
    saveJsonFile(dbPath, { scenarios: [] });
  }
};

/**
 * Get all scenarios from database
 * @param {string} dbPath - Custom database path (optional, for testing)
 * @returns {Object} Database object with scenarios array
 */
export const findAll = (dbPath = DB_PATH) => {
  ensureDatabase(dbPath);
  return readJsonFile(dbPath);
};

/**
 * Find scenario by ID
 * @param {string} id - Scenario ID
 * @param {string} dbPath - Custom database path (optional, for testing)
 * @returns {Object|undefined} Scenario object or undefined
 */
export const findById = (id, dbPath = DB_PATH) => {
  const db = findAll(dbPath);
  return db.scenarios.find(scenario => scenario.id === id);
};

/**
 * Create a new scenario entry
 * @param {Object} featureData - Feature data
 * @param {Object} generatedScenarios - Generated scenarios
 * @param {string} provider - AI provider used
 * @param {string} dbPath - Custom database path (optional, for testing)
 * @returns {Object} Created scenario entry
 */
export const create = (featureData, generatedScenarios, provider = 'openai', dbPath = DB_PATH) => {
  ensureDatabase(dbPath);
  const db = findAll(dbPath);

  const scenarioEntry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    feature: featureData,
    scenarios: generatedScenarios,
    provider,
  };

  db.scenarios.push(scenarioEntry);
  saveJsonFile(dbPath, db);

  return scenarioEntry;
};

/**
 * Delete scenario by ID
 * @param {string} id - Scenario ID
 * @param {string} dbPath - Custom database path (optional, for testing)
 * @returns {boolean|null} True if deleted, null if not found
 */
export const deleteById = (id, dbPath = DB_PATH) => {
  ensureDatabase(dbPath);
  const db = findAll(dbPath);
  const initialLength = db.scenarios.length;

  db.scenarios = db.scenarios.filter(scenario => scenario.id !== id);

  if (db.scenarios.length === initialLength) {
    return null;
  }

  saveJsonFile(dbPath, db);
  return true;
};
