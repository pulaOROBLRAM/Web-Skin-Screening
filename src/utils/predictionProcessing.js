/**
 * Prediction processing utilities
 * Handles top prediction extraction and formatting
 */

import { CONDITION_DESCRIPTIONS } from '../data/conditions';

/**
 * Extract top prediction and enrich with detailed information
 * @param {Object} predictions - Raw predictions from API
 * @returns {Object|null} - Top prediction with enriched details
 */
export function getTopPredictionWithDetails(predictions) {
  if (!predictions?.predictions) return null;
  
  const sortedPredictions = Object.entries(predictions.predictions)
    .map(([condition, probability]) => {
      const desc = CONDITION_DESCRIPTIONS[condition] || {};
      return {
        condition,
        probability,
        name: desc.name || condition,
        description: desc.description,
        description1: desc.description1,
        treatment: desc.treatment || "Unknown",
        recommendations: desc.recommendations || [],
        severity: desc.severity || "Unknown"
      };
    })
    .sort((a, b) => b.probability - a.probability);
  
  return sortedPredictions.length > 0 ? sortedPredictions[0] : null;
}

/**
 * Find condition description by disease name with multiple format attempts
 * @param {string} diseaseName - Disease name in various formats
 * @returns {Object} - Condition description object
 */
export function findConditionDescription(diseaseName) {
  // Try transformation variants
  const key1 = diseaseName.replace(/_/g, ' ');
  const key2 = diseaseName.replace(/_/g, '').replace(/\b\w/g, l => l.toUpperCase());
  const key3 = diseaseName.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  if (CONDITION_DESCRIPTIONS[key1]) return CONDITION_DESCRIPTIONS[key1];
  if (CONDITION_DESCRIPTIONS[key2]) return CONDITION_DESCRIPTIONS[key2];
  if (CONDITION_DESCRIPTIONS[key3]) return CONDITION_DESCRIPTIONS[key3];
  
  // Find by name property
  const found = Object.values(CONDITION_DESCRIPTIONS).find(desc => 
    desc?.name && 
    desc.name.toLowerCase().replace(/\s+/g, '') === 
    diseaseName.toLowerCase().replace(/_/g, '')
  );
  
  return found || {};
}

/**
 * Format disease name for display
 * @param {string} diseaseName - Raw disease name
 * @param {Object} conditionInfo - Condition description object
 * @returns {string} - Formatted disease name
 */
export function formatDiseaseName(diseaseName, conditionInfo) {
  if (conditionInfo?.name) {
    return conditionInfo.name;
  }
  
  return diseaseName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || diseaseName.replace(/_/g, ' ');
}

/**
 * Get CSS severity class based on severity text
 * @param {string} severity - Severity description
 * @returns {string} - CSS class ('high', 'medium', 'low')
 */
export function getSeverityClass(severity) {
  if (!severity) return 'low';
  
  const lowercased = severity.toLowerCase();
  if (lowercased.includes('high')) return 'high';
  if (lowercased.includes('medium')) return 'medium';
  
  return 'low';
}
