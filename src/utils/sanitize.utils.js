/**
 * Sanitize a string to be used as a filename
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeFilename = str => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Generate a filename from a feature name
 * @param {string} featureName - Name of the feature
 * @returns {string} Generated filename
 */
export const generateFeatureFilename = featureName => {
  const sanitizedName = sanitizeFilename(featureName || 'unnamed-feature');
  return `feature-${sanitizedName}.json`;
};
