import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import {
  getAllScenarios,
  saveScenario,
  getScenarioById,
  deleteScenarioById,
} from '../../src/database/scenario-db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_DB_PATH = path.join(__dirname, '..', '..', 'database', 'scenarios.json');

describe('Scenario Database', () => {
  beforeAll(() => {
    // Force clean start
    const dbDir = path.dirname(TEST_DB_PATH);
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  beforeEach(() => {
    // Clean up database before each test
    const dbDir = path.dirname(TEST_DB_PATH);
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  afterEach(() => {
    // Clean up database after each test
    const dbDir = path.dirname(TEST_DB_PATH);
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  describe('getAllScenarios', () => {
    it('should create database file if it does not exist', () => {
      const result = getAllScenarios();
      expect(result).toEqual({ scenarios: [] });
      expect(fs.existsSync(TEST_DB_PATH)).toBe(true);
    });

    it('should return existing scenarios from database', () => {
      // Create database with test data
      const testData = {
        scenarios: [
          {
            id: 'test-id-1',
            feature: { name: 'Test Feature' },
            scenarios: [],
            provider: 'openai',
          },
        ],
      };
      fs.mkdirSync(path.dirname(TEST_DB_PATH), { recursive: true });
      fs.writeFileSync(TEST_DB_PATH, JSON.stringify(testData));

      const result = getAllScenarios();
      expect(result.scenarios).toHaveLength(1);
      expect(result.scenarios[0].id).toBe('test-id-1');
    });
  });

  describe('saveScenario', () => {
    it('should save a new scenario with generated ID', () => {
      const featureData = {
        name: 'User Login',
        description: 'User authentication feature',
      };
      const generatedScenarios = {
        scenarios: [{ title: 'Successful login', steps: [] }],
      };

      const saved = saveScenario(featureData, generatedScenarios, 'openai');

      expect(saved.id).toBeDefined();
      expect(saved.createdAt).toBeDefined();
      expect(saved.feature).toEqual(featureData);
      expect(saved.scenarios).toEqual(generatedScenarios);
      expect(saved.provider).toBe('openai');
    });

    it('should append new scenario to existing database', () => {
      const feature1 = { name: 'Feature 1' };
      const feature2 = { name: 'Feature 2' };

      saveScenario(feature1, {}, 'openai');
      saveScenario(feature2, {}, 'github');

      const db = getAllScenarios();
      expect(db.scenarios).toHaveLength(2);
      expect(db.scenarios[0].feature.name).toBe('Feature 1');
      expect(db.scenarios[1].feature.name).toBe('Feature 2');
    });
  });

  describe('getScenarioById', () => {
    it('should return scenario by ID', () => {
      const saved = saveScenario({ name: 'Test' }, {}, 'openai');
      const found = getScenarioById(saved.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(saved.id);
    });

    it('should return undefined for non-existent ID', () => {
      const found = getScenarioById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('deleteScenarioById', () => {
    it('should delete scenario by ID', () => {
      const saved = saveScenario({ name: 'Test' }, {}, 'openai');
      const deleted = deleteScenarioById(saved.id);

      expect(deleted).toBe(true);

      const db = getAllScenarios();
      expect(db.scenarios).toHaveLength(0);
    });

    it('should return null for non-existent ID', () => {
      const deleted = deleteScenarioById('non-existent-id');
      expect(deleted).toBeNull();
    });

    it('should not affect other scenarios when deleting', () => {
      const saved1 = saveScenario({ name: 'Feature 1' }, {}, 'openai');
      const saved2 = saveScenario({ name: 'Feature 2' }, {}, 'openai');

      deleteScenarioById(saved1.id);

      const db = getAllScenarios();
      expect(db.scenarios).toHaveLength(1);
      expect(db.scenarios[0].id).toBe(saved2.id);
    });
  });
});
