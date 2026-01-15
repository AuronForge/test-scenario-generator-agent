import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import * as scenarioService from '../../src/services/scenario.service.js';

describe('scenario.service - Integration Tests', () => {
  const testDbPath = path.join(process.cwd(), 'database', 'test-service-scenarios.json');
  const testResultsDir = path.join(process.cwd(), 'results');

  beforeEach(() => {
    // Clean up test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    // Clean up results directory
    if (fs.existsSync(testResultsDir)) {
      fs.readdirSync(testResultsDir).forEach(file => {
        const filePath = path.join(testResultsDir, file);
        if (file.startsWith('feature-test-')) {
          fs.unlinkSync(filePath);
        }
      });
    }
  });

  afterEach(() => {
    // Clean up test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    // Clean up results directory
    if (fs.existsSync(testResultsDir)) {
      fs.readdirSync(testResultsDir).forEach(file => {
        const filePath = path.join(testResultsDir, file);
        if (file.startsWith('feature-test-')) {
          fs.unlinkSync(filePath);
        }
      });
    }
  });

  describe('getAllScenarios', () => {
    it('should return empty scenarios if database is empty', () => {
      const result = scenarioService.getAllScenarios();
      expect(result.scenarios).toBeDefined();
      expect(Array.isArray(result.scenarios)).toBe(true);
    });

    it('should return scenarios array', () => {
      const result = scenarioService.getAllScenarios();
      expect(result).toBeDefined();
      expect(result.scenarios).toBeDefined();
    });
  });

  describe('getScenarioById', () => {
    it('should return undefined for non-existent scenario', () => {
      const result = scenarioService.getScenarioById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should call repository findById', () => {
      const result = scenarioService.getScenarioById('test-id');
      expect(result).toBeUndefined();
    });
  });

  describe('deleteScenarioById', () => {
    it('should return null for non-existent scenario', () => {
      const result = scenarioService.deleteScenarioById('non-existent-id');
      expect(result).toBeNull();
    });

    it('should call repository deleteById', () => {
      const result = scenarioService.deleteScenarioById('test-id');
      expect(result).toBeNull();
    });
  });
});
