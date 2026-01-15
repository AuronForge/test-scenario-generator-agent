import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import * as scenarioRepository from '../../src/repositories/scenario.repository.js';

describe('scenario.repository', () => {
  const testDbPath = path.join(process.cwd(), 'database', 'test-scenarios.json');

  beforeEach(() => {
    // Clean up test database before each test
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  afterEach(() => {
    // Clean up test database after each test
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('findAll', () => {
    it('should return empty scenarios array if database does not exist', () => {
      const result = scenarioRepository.findAll(testDbPath);
      expect(result).toEqual({ scenarios: [] });
      expect(result.scenarios).toHaveLength(0);
    });

    it('should return all scenarios from database', () => {
      const testData = {
        scenarios: [
          { id: '1', feature: { name: 'Feature 1' } },
          { id: '2', feature: { name: 'Feature 2' } },
        ],
      };

      const dbDir = path.dirname(testDbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(testDbPath, JSON.stringify(testData, null, 2), 'utf8');

      const result = scenarioRepository.findAll(testDbPath);
      expect(result.scenarios).toHaveLength(2);
      expect(result.scenarios[0].id).toBe('1');
      expect(result.scenarios[1].id).toBe('2');
    });
  });

  describe('findById', () => {
    it('should return undefined if scenario is not found', () => {
      const testData = {
        scenarios: [{ id: '1', feature: { name: 'Feature 1' } }],
      };

      const dbDir = path.dirname(testDbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(testDbPath, JSON.stringify(testData, null, 2), 'utf8');

      const result = scenarioRepository.findById('non-existent-id', testDbPath);
      expect(result).toBeUndefined();
    });

    it('should return scenario if found', () => {
      const scenario = { id: '123', feature: { name: 'Test Feature' } };
      const testData = { scenarios: [scenario] };

      const dbDir = path.dirname(testDbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(testDbPath, JSON.stringify(testData, null, 2), 'utf8');

      const result = scenarioRepository.findById('123', testDbPath);
      expect(result).toEqual(scenario);
    });
  });

  describe('create', () => {
    it('should create new scenario in database', () => {
      const featureData = { name: 'New Feature' };
      const generatedScenarios = [];

      const result = scenarioRepository.create(
        featureData,
        generatedScenarios,
        'openai',
        testDbPath
      );

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('createdAt');
      expect(result.feature).toEqual(featureData);
      expect(result.scenarios).toEqual(generatedScenarios);
      expect(result.provider).toBe('openai');

      expect(fs.existsSync(testDbPath)).toBe(true);

      const db = JSON.parse(fs.readFileSync(testDbPath, 'utf8'));
      expect(db.scenarios).toHaveLength(1);
    });

    it('should append to existing scenarios', () => {
      const existingScenario = {
        id: '1',
        feature: { name: 'Existing Feature' },
        scenarios: [],
        provider: 'openai',
        createdAt: new Date().toISOString(),
      };
      const testData = { scenarios: [existingScenario] };

      const dbDir = path.dirname(testDbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(testDbPath, JSON.stringify(testData, null, 2), 'utf8');

      const featureData = { name: 'New Feature' };
      const generatedScenarios = [];

      scenarioRepository.create(featureData, generatedScenarios, 'openai', testDbPath);

      const db = JSON.parse(fs.readFileSync(testDbPath, 'utf8'));
      expect(db.scenarios).toHaveLength(2);
      expect(db.scenarios[0]).toEqual(existingScenario);
      expect(db.scenarios[1].feature).toEqual(featureData);
    });

    it('should create database directory if it does not exist', () => {
      const dbDir = path.dirname(testDbPath);
      if (fs.existsSync(dbDir)) {
        fs.rmSync(dbDir, { recursive: true, force: true });
      }

      const featureData = { name: 'Test' };
      scenarioRepository.create(featureData, [], 'openai', testDbPath);

      expect(fs.existsSync(dbDir)).toBe(true);
      expect(fs.existsSync(testDbPath)).toBe(true);
    });

    it('should generate unique UUID for each scenario', () => {
      const featureData = { name: 'Feature' };
      const scenarios = [];

      const result1 = scenarioRepository.create(featureData, scenarios, 'openai', testDbPath);
      const result2 = scenarioRepository.create(featureData, scenarios, 'openai', testDbPath);

      expect(result1.id).not.toBe(result2.id);
      expect(result1.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(result2.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should use default provider as openai', () => {
      const featureData = { name: 'Feature' };
      const result = scenarioRepository.create(featureData, [], undefined, testDbPath);

      expect(result.provider).toBe('openai');
    });
  });

  describe('deleteById', () => {
    it('should return null if scenario is not found', () => {
      const testData = {
        scenarios: [{ id: '1', feature: { name: 'Feature 1' } }],
      };

      const dbDir = path.dirname(testDbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(testDbPath, JSON.stringify(testData, null, 2), 'utf8');

      const result = scenarioRepository.deleteById('non-existent-id', testDbPath);
      expect(result).toBeNull();
    });

    it('should delete scenario and return true if found', () => {
      const testData = {
        scenarios: [
          { id: '1', feature: { name: 'Feature 1' } },
          { id: '2', feature: { name: 'Feature 2' } },
        ],
      };

      const dbDir = path.dirname(testDbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(testDbPath, JSON.stringify(testData, null, 2), 'utf8');

      const result = scenarioRepository.deleteById('1', testDbPath);

      expect(result).toBe(true);

      const db = JSON.parse(fs.readFileSync(testDbPath, 'utf8'));
      expect(db.scenarios).toHaveLength(1);
      expect(db.scenarios[0].id).toBe('2');
    });

    it('should save updated database after deletion', () => {
      const testData = {
        scenarios: [
          { id: '1', feature: { name: 'Feature 1' } },
          { id: '2', feature: { name: 'Feature 2' } },
        ],
      };

      const dbDir = path.dirname(testDbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(testDbPath, JSON.stringify(testData, null, 2), 'utf8');

      scenarioRepository.deleteById('1', testDbPath);

      const db = JSON.parse(fs.readFileSync(testDbPath, 'utf8'));
      expect(db.scenarios).not.toContainEqual(expect.objectContaining({ id: '1' }));
      expect(db.scenarios).toContainEqual(expect.objectContaining({ id: '2' }));
    });
  });
});
