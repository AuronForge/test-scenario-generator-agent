import { describe, it, expect } from '@jest/globals';
import { sanitizeFilename, generateFeatureFilename } from '../../src/utils/sanitize.utils.js';

describe('sanitize.utils', () => {
  describe('sanitizeFilename', () => {
    it('should convert string to lowercase', () => {
      const result = sanitizeFilename('MyFeature');
      expect(result).toBe('myfeature');
    });

    it('should replace spaces with hyphens', () => {
      const result = sanitizeFilename('My Feature');
      expect(result).toBe('my-feature');
    });

    it('should remove special characters', () => {
      const result = sanitizeFilename('My@Feature#123!');
      expect(result).toBe('my-feature-123');
    });

    it('should remove leading and trailing hyphens', () => {
      const result = sanitizeFilename('-My Feature-');
      expect(result).toBe('my-feature');
    });

    it('should replace multiple consecutive hyphens with single hyphen', () => {
      const result = sanitizeFilename('My---Feature');
      expect(result).toBe('my-feature');
    });

    it('should handle empty string', () => {
      const result = sanitizeFilename('');
      expect(result).toBe('');
    });

    it('should handle special characters only', () => {
      const result = sanitizeFilename('@#$%');
      expect(result).toBe('');
    });

    it('should handle accented characters', () => {
      const result = sanitizeFilename('Café Feature');
      expect(result).toBe('caf-feature');
    });

    it('should handle numbers', () => {
      const result = sanitizeFilename('Feature 123');
      expect(result).toBe('feature-123');
    });

    it('should handle mixed case with multiple words', () => {
      const result = sanitizeFilename('My Amazing Feature Test');
      expect(result).toBe('my-amazing-feature-test');
    });
  });

  describe('generateFeatureFilename', () => {
    it('should generate filename with feature prefix', () => {
      const result = generateFeatureFilename('My Feature');
      expect(result).toBe('feature-my-feature.json');
    });

    it('should sanitize feature name', () => {
      const result = generateFeatureFilename('My@Feature#123');
      expect(result).toBe('feature-my-feature-123.json');
    });

    it('should handle empty feature name', () => {
      const result = generateFeatureFilename('');
      expect(result).toBe('feature-unnamed-feature.json');
    });

    it('should handle undefined feature name', () => {
      const result = generateFeatureFilename(undefined);
      expect(result).toBe('feature-unnamed-feature.json');
    });

    it('should handle null feature name', () => {
      const result = generateFeatureFilename(null);
      expect(result).toBe('feature-unnamed-feature.json');
    });

    it('should handle special characters in feature name', () => {
      const result = generateFeatureFilename('User Login & Authentication');
      expect(result).toBe('feature-user-login-authentication.json');
    });
  });
});
