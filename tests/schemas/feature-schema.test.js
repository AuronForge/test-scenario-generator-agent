import { describe, it, expect } from '@jest/globals';
import { FeatureSchema, validateFeature } from '../../src/schemas/feature-schema.js';

describe('FeatureSchema', () => {
  describe('Valid Feature Data', () => {
    it('should validate a complete valid feature', () => {
      const validFeature = {
        id: 'feat-001',
        name: 'User Authentication',
        description: 'Implement user login with email and password',
        type: 'user-story',
        priority: 'high',
        acceptanceCriteria: [
          'User can login with valid credentials',
          'Error shown for invalid credentials'
        ],
        technicalDetails: {
          endpoints: ['/api/auth/login'],
          components: ['LoginForm', 'AuthService'],
          dependencies: ['bcrypt']
        },
        userFlows: [
          {
            step: 1,
            action: 'Enter credentials',
            expectedResult: 'Form validates'
          }
        ],
        businessRules: ['Password must be 8+ characters'],
        metadata: { team: 'backend' }
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
      expect(result.name).toBe('Simple Feature');
      expect(result.priority).toBe('medium');
    });

    it('should accept all valid feature types', () => {
      const types = ['user-story', 'epic', 'task', 'bug-fix'];
      
      types.forEach(type => {
        const feature = {
          name: 'Test Feature',
          description: 'Test description for validation',
          type,
          acceptanceCriteria: ['Test criterion']
        };
        
        expect(() => validateFeature(feature)).not.toThrow();
      });
    });

    it('should accept all valid priority levels', () => {
      const priorities = ['low', 'medium', 'high', 'critical'];
      
      priorities.forEach(priority => {
        const feature = {
          name: 'Test Feature',
          description: 'Test description for validation',
          type: 'task',
          priority,
          acceptanceCriteria: ['Test criterion']
        };
        
        expect(() => validateFeature(feature)).not.toThrow();
      });
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

    it('should reject feature with empty name', () => {
      const invalidFeature = {
        name: '',
        description: 'Empty name field',
        type: 'task',
        acceptanceCriteria: ['Criterion 1']
      };

      expect(() => validateFeature(invalidFeature)).toThrow();
    });

    it('should reject feature with short description', () => {
      const invalidFeature = {
        name: 'Test',
        description: 'Short',
        type: 'task',
        acceptanceCriteria: ['Criterion 1']
      };

      expect(() => validateFeature(invalidFeature)).toThrow();
    });

    it('should reject feature with invalid type', () => {
      const invalidFeature = {
        name: 'Test Feature',
        description: 'Test description for validation',
        type: 'invalid-type',
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

    it('should reject feature with invalid priority', () => {
      const invalidFeature = {
        name: 'Test Feature',
        description: 'Test description for validation',
        type: 'task',
        priority: 'super-urgent',
        acceptanceCriteria: ['Criterion 1']
      };

      expect(() => validateFeature(invalidFeature)).toThrow();
    });
  });

  describe('Optional Fields', () => {
    it('should handle optional technicalDetails', () => {
      const feature = {
        name: 'Test Feature',
        description: 'Test description for validation',
        type: 'task',
        acceptanceCriteria: ['Criterion 1'],
        technicalDetails: {
          endpoints: ['/api/test']
        }
      };

      const result = validateFeature(feature);
      expect(result.technicalDetails.endpoints).toEqual(['/api/test']);
    });

    it('should handle optional userFlows', () => {
      const feature = {
        name: 'Test Feature',
        description: 'Test description for validation',
        type: 'task',
        acceptanceCriteria: ['Criterion 1'],
        userFlows: [
          { step: 1, action: 'Do something', expectedResult: 'Result' }
        ]
      };

      const result = validateFeature(feature);
      expect(result.userFlows).toHaveLength(1);
    });

    it('should handle optional businessRules', () => {
      const feature = {
        name: 'Test Feature',
        description: 'Test description for validation',
        type: 'task',
        acceptanceCriteria: ['Criterion 1'],
        businessRules: ['Rule 1', 'Rule 2']
      };

      const result = validateFeature(feature);
      expect(result.businessRules).toHaveLength(2);
    });
  });
});