import { describe, it, expect } from '@jest/globals';
import { validateFeature } from '../../src/schemas/feature-schema.js';

describe('FeatureSchema', () => {
  describe('Valid Feature Data', () => {
    it('should validate a complete valid feature', () => {
      const validFeature = {
        id: 'feat-001',
        name: 'User Authentication',
        description: 'Implement user login with email and password',
        type:  'user-story',
        priority: 'high',
        acceptanceCriteria: [
          'User can login with valid credentials',
          'Error shown for invalid credentials'
        ]
      };

      const result = validateFeature(validFeature);
      expect(result).toEqual(validFeature);
    });

    it('should validate feature with minimal required fields', () => {
      const minimalFeature = {
        name: 'Simple Feature',
        description: 'A simple feature description',
        type: 'task',
        acceptanceCriteria: ['Criterion 1']
      };

      const result = validateFeature(minimalFeature);
      expect(result. name).toBe('Simple Feature');
      expect(result.priority).toBe('medium');
    });
  });

  describe('Invalid Feature Data', () => {
    it('should reject feature without name', () => {
      const invalidFeature = {
        description: 'Missing name field',
        type: 'task',
        acceptanceCriteria: ['Criterion 1']
      };

      expect(() => validateFeature(invalidFeature)).toThrow();
    });

    it('should reject feature with empty acceptance criteria', () => {
      const invalidFeature = {
        name: 'Test Feature',
        description: 'Test description for validation',
        type: 'task',
        acceptanceCriteria: []
      };

      expect(() => validateFeature(invalidFeature)).toThrow();
    });
  });
});
