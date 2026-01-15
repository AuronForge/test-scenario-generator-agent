import { describe, it, expect } from '@jest/globals';
import { validateFeature } from '../../src/schemas/feature-schema.js';

describe('FeatureSchema', () => {
  describe('Valid Feature Data', () => {
    it('should validate a complete valid feature', () => {
      const validFeature = {
        id: 'feat-001',
        name: 'User Authentication',
        description: 'Implement user login with email and password',
        type: 'user-story'
      };

      const result = validateFeature(validFeature);
      expect(result).toEqual(validFeature);
    });

    it('should validate feature with minimal required fields', () => {
      const minimalFeature = {
        name: 'Simple Feature',
        description: 'A simple feature description',
        type: 'task'
      };

      const result = validateFeature(minimalFeature);
      expect(result.name).toBe('Simple Feature');
      expect(result.type).toBe('task');
    });
  });

  describe('Invalid Feature Data', () => {
    it('should reject feature without name', () => {
      const invalidFeature = {
        description: 'Missing name field',
        type: 'task'
      };

      expect(() => validateFeature(invalidFeature)).toThrow();
    });

    it('should reject feature with short description', () => {
      const invalidFeature = {
        name: 'Test Feature',
        description: 'Short',
        type: 'task'
      };

      expect(() => validateFeature(invalidFeature)).toThrow();
    });
  });
});
