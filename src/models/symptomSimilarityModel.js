import { DISEASES } from '../data/diseases';

const ATTRIBUTE_WEIGHTS = {
  // Primary discriminators (highest weight)
  lesionForm: 0.20,  // What it looks like - most specific
  color: 0.15,       // Color - highly specific
  distribution: 0.15, // Where it appears - very specific
  
  // Secondary discriminators
  surface: 0.10,     // Surface texture
  border: 0.10,      // Border characteristics
  configuration: 0.08, // Pattern/arrangement
  
  // Tertiary discriminators
  sensation: 0.07,   // Itch/pain
  chronicity: 0.06,  // Time course
  
  // Supporting evidence
  triggers: 0.04,    // Triggers
  associatedFindings: 0.03, // Associated symptoms
  demographics: 0.02 // Age/risk factors
};

const EXACT_MATCH_BOOST = 1.5;  // Exact matches get 50% boost
const PARTIAL_MATCH_FACTOR = 0.7; // Partial matches get 70% of full weight

/**
 * Calculates clinical similarity between diseases based on their attributes
 */

// Flatten the attributes structure for easier access
const DISEASE_ATTRIBUTES = {};

// Process DISEASES contents into a flat disease->simple attr array map
Object.entries(DISEASES || {}).forEach(([categoryName, diseasesInCategory]) => {
  Object.entries(diseasesInCategory || {}).forEach(([diseaseName, diseaseConfig]) => {
    const attrs = diseaseConfig?.attributes || {};
    const shape = {};

    Object.entries(attrs).forEach(([attrKey, attrDef]) => {
      const value = attrDef?.value;
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        shape[attrKey] = value;
      } else if (typeof value === 'string' || typeof value === 'number') {
        shape[attrKey] = [String(value)];
      } else if (typeof value === 'object' && value !== null && Array.isArray(value.value)) {
        shape[attrKey] = value.value;
      }
    });

    DISEASE_ATTRIBUTES[diseaseName] = shape;
  });
});

// List of all diseases in the system
export const ALL_DISEASES = Object.keys(DISEASE_ATTRIBUTES).sort();

/**
 * Check if two diseases are in the same category
 * (RASH_OR_REDNESS, GROWTH_OR_LUMP, etc.)
 */
function getDiseaseCategory(diseaseName) {
  for (const [categoryName, diseasesInCategory] of Object.entries(DISEASES || {})) {
    if (diseasesInCategory?.[diseaseName]) {
      return categoryName;
    }
  }
  return null;
}

/**
 * Normalize text for comparison
 */
function normalizeText(text) {
  return text.toLowerCase().trim();
}

/**
 * Calculate Jaccard similarity between two sets
 * Jaccard = intersection size / union size
 */
function jaccardSimilarity(set1, set2) {
  if (!set1 || !set2) return 0;
  if (set1.size === 0 && set2.size === 0) return 1;
  if (set1.size === 0 || set2.size === 0) return 0;
  
  // Calculate intersection
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  
  // Calculate union
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Flatten attribute object into a set of characteristic strings
 */
function flattenAttributesToSet(attrSet) {
  const flat = [];
  
  // Define which attributes to include
  const attributeCategories = Object.keys(ATTRIBUTE_WEIGHTS);
  
  attributeCategories.forEach(key => {
    const values = attrSet[key];
    if (Array.isArray(values)) {
      values.forEach(v => {
        // Create a normalized key-value pair
        flat.push(`${key}:${normalizeText(v)}`);
      });
    }
  });
  
  return new Set(flat);
}

/**
 * Calculate weighted similarity using the new ATTRIBUTE_WEIGHTS with boost factors
 */
function weightedAttributeSimilarity(disease1, disease2) {
  if (!disease1 || !disease2) return 0;
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  Object.entries(ATTRIBUTE_WEIGHTS).forEach(([attribute, weight]) => {
    const values1 = disease1[attribute] || [];
    const values2 = disease2[attribute] || [];
    
    if (values1.length > 0 && values2.length > 0) {
      // Convert to normalized sets for comparison
      const set1 = new Set(values1.map(v => normalizeText(v)));
      const set2 = new Set(values2.map(v => normalizeText(v)));
      
      // Check for exact matches
      const exactMatches = [...set1].filter(x => set2.has(x)).length;
      
      // Check for partial matches (where one contains the other)
      let partialMatches = 0;
      if (exactMatches === 0) {
        [...set1].forEach(val1 => {
          [...set2].forEach(val2 => {
            if (val1.includes(val2) || val2.includes(val1)) {
              partialMatches++;
            }
          });
        });
      }
      
      // Calculate similarity with boost factors
      let similarity = 0;
      if (exactMatches > 0) {
        // Exact matches get boost
        similarity = Math.min(1, (exactMatches / Math.min(set1.size, set2.size)) * EXACT_MATCH_BOOST);
      } else if (partialMatches > 0) {
        // Partial matches get reduced weight
        similarity = (partialMatches / (set1.size + set2.size)) * PARTIAL_MATCH_FACTOR;
      }
      
      weightedSum += similarity * weight;
      totalWeight += weight;
    }
  });
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Calculate comprehensive similarity score between two diseases
 */
function calculateSimilarity(disease1Name, disease2Name) {
  // Same disease = perfect similarity
  if (disease1Name === disease2Name) return 1.0;
  
  const attrs1 = DISEASE_ATTRIBUTES[disease1Name];
  const attrs2 = DISEASE_ATTRIBUTES[disease2Name];
  
  if (!attrs1 || !attrs2) {
    console.warn(`Missing attributes for: ${!attrs1 ? disease1Name : disease2Name}`);
    return 0;
  }
  
  // Calculate different similarity metrics
  const set1 = flattenAttributesToSet(attrs1);
  const set2 = flattenAttributesToSet(attrs2);
  
  const jaccard = jaccardSimilarity(set1, set2);
  const weighted = weightedAttributeSimilarity(attrs1, attrs2);
  
  // Category boost - same category diseases are more likely to be similar
  const category1 = getDiseaseCategory(disease1Name);
  const category2 = getDiseaseCategory(disease2Name);
  const categoryBoost = (category1 && category2 && category1 === category2) ? 0.1 : 0;
  
  // Combine scores (weights can be adjusted based on performance)
  const combinedScore = (jaccard * 0.3) + (weighted * 0.6) + categoryBoost;
  
  // Normalize to 0-1 range and ensure it doesn't exceed 1.0
  return Math.min(1, Math.max(0, combinedScore));
}

/**
 * Check if a disease has a specific attribute value
 * @param {string} diseaseName - Name of the disease
 * @param {string} attribute - Attribute category (color, lesionForm, etc.)
 * @param {string} value - Specific value to check for
 * @returns {boolean} - True if disease has this attribute
 */
export function diseaseHasAttribute(diseaseName, attribute, value) {
  const disease = DISEASE_ATTRIBUTES[diseaseName];
  if (!disease) return false;
  
  const values = disease[attribute];
  if (!Array.isArray(values)) return false;
  
  const normalizedValue = normalizeText(value);
  return values.some(v => normalizeText(v).includes(normalizedValue) || 
                         normalizedValue.includes(normalizeText(v)));
}

/**
 * Get all diseases that share a specific attribute with the top prediction
 * @param {string} topDisease - Name of the top predicted disease
 * @param {string} attribute - Attribute category to check (e.g., 'color')
 * @returns {Object} - Map of disease names to boost amounts
 */
export function getAttributeBasedBoosts(topDisease, attribute = 'color') {
  if (!topDisease || !DISEASE_ATTRIBUTES[topDisease]) {
    return {};
  }
  
  const topAttributes = DISEASE_ATTRIBUTES[topDisease];
  const attributeValues = topAttributes[attribute] || [];
  
  if (attributeValues.length === 0) return {};
  
  const boosts = {};
  
  // For each disease, check if it shares ANY of the same attribute values
  Object.keys(DISEASE_ATTRIBUTES).forEach(diseaseName => {
    if (diseaseName === topDisease) {
      boosts[diseaseName] = 1.0; // Self gets full boost
      return;
    }
    
    const disease = DISEASE_ATTRIBUTES[diseaseName];
    const diseaseValues = disease[attribute] || [];
    
    if (diseaseValues.length === 0) {
      boosts[diseaseName] = 0;
      return;
    }
    
    // Calculate overlap in attribute values
    let matchCount = 0;
    attributeValues.forEach(topValue => {
      const normalizedTop = normalizeText(topValue);
      diseaseValues.forEach(diseaseValue => {
        const normalizedDisease = normalizeText(diseaseValue);
        if (normalizedDisease.includes(normalizedTop) || 
            normalizedTop.includes(normalizedDisease)) {
          matchCount++;
        }
      });
    });
    
    // Boost is proportional to how many values match
    const maxPossible = Math.max(attributeValues.length, diseaseValues.length);
    boosts[diseaseName] = maxPossible > 0 ? matchCount / maxPossible : 0;
  });
  
  return boosts;
}

/**
 * Get color-based boosts specifically
 * This implements your example: if top prediction is "red", boost other red diseases
 */
export function getColorBasedBoosts(topDisease) {
  return getAttributeBasedBoosts(topDisease, 'color');
}

/**
 * Get lesionForm-based boosts
 */
export function getLesionFormBasedBoosts(topDisease) {
  return getAttributeBasedBoosts(topDisease, 'lesionForm');
}

/**
 * Get distribution-based boosts
 */
export function getDistributionBasedBoosts(topDisease) {
  return getAttributeBasedBoosts(topDisease, 'distribution');
}

/**
 * Calculate penalty for diseases that DON'T match key attributes
 * @param {string} diseaseName - Disease to check
 * @param {string} topDisease - Top prediction
 * @param {Array} keyAttributes - List of important attributes to check
 * @returns {number} - Penalty factor (0-1, where 1 means no penalty, 0 means full penalty)
 */
export function calculateAttributePenalty(diseaseName, topDisease, keyAttributes = ['color', 'lesionForm', 'distribution']) {
  if (diseaseName === topDisease) return 1.0; // No penalty for top disease
  
  const disease = DISEASE_ATTRIBUTES[diseaseName];
  const top = DISEASE_ATTRIBUTES[topDisease];
  
  if (!disease || !top) return 0.5; // Default medium penalty
  
  let matchScore = 0;
  let totalWeight = 0;
  
  // Weight for each attribute (color most important for your example)
  const weights = {
    color: 0.5,
    lesionForm: 0.3,
    distribution: 0.2
  };
  
  keyAttributes.forEach(attr => {
    const topValues = top[attr] || [];
    const diseaseValues = disease[attr] || [];
    
    if (topValues.length > 0 && diseaseValues.length > 0) {
      // Check for any match
      let hasMatch = false;
      topValues.forEach(topVal => {
        const normalizedTop = normalizeText(topVal);
        diseaseValues.forEach(diseaseVal => {
          const normalizedDisease = normalizeText(diseaseVal);
          if (normalizedDisease.includes(normalizedTop) || 
              normalizedTop.includes(normalizedDisease)) {
            hasMatch = true;
          }
        });
      });
      
      if (hasMatch) {
        matchScore += weights[attr] || 0;
      }
      totalWeight += weights[attr] || 0;
    }
  });
  
  return totalWeight > 0 ? matchScore / totalWeight : 0.5;
}

/**
 * Enhanced similarity function that includes attribute-based boosting and penalties
 */
export function getEnhancedSimilarityScores(topDisease, options = {
  boostAttributes: ['color', 'lesionForm', 'distribution'],
  penaltyAttributes: ['color', 'lesionForm'],
  colorBoost: 0.3,
  lesionFormBoost: 0.2,
  distributionBoost: 0.1
}) {
  if (!topDisease || !DISEASE_ATTRIBUTES[topDisease]) {
    return {};
  }
  
  const scores = {};
  
  Object.keys(DISEASE_ATTRIBUTES).forEach(diseaseName => {
    if (diseaseName === topDisease) {
      scores[diseaseName] = 1.0;
      return;
    }
    
    let score = 0;
    
    // Calculate matches for each attribute
    options.boostAttributes.forEach(attr => {
      const topValues = DISEASE_ATTRIBUTES[topDisease][attr] || [];
      const diseaseValues = DISEASE_ATTRIBUTES[diseaseName][attr] || [];
      
      if (topValues.length > 0 && diseaseValues.length > 0) {
        let matchFound = false;
        topValues.forEach(topVal => {
          const normalizedTop = normalizeText(topVal);
          diseaseValues.forEach(diseaseVal => {
            const normalizedDisease = normalizeText(diseaseVal);
            if (normalizedDisease.includes(normalizedTop) || 
                normalizedTop.includes(normalizedDisease)) {
              matchFound = true;
            }
          });
        });
        
        if (matchFound) {
          // Add appropriate boost based on attribute
          switch(attr) {
            case 'color':
              score += options.colorBoost;
              break;
            case 'lesionForm':
              score += options.lesionFormBoost;
              break;
            case 'distribution':
              score += options.distributionBoost;
              break;
            default:
              score += 0.1;
          }
        }
      }
    });
    
    // Apply penalty for missing key attributes
    const penalty = calculateAttributePenalty(diseaseName, topDisease, options.penaltyAttributes);
    score = score * penalty;
    
    scores[diseaseName] = Math.min(1, score);
  });
  
  return scores;
}

/**
 * Get similarity scores for all diseases compared to a target disease
 * @param {string} targetDisease - Name of the disease to compare against
 * @returns {Object} - Map of disease names to similarity scores (0-1)
 */
export function getAttributeSimilarityScores(targetDisease) {
  return getEnhancedSimilarityScores(targetDisease);
}

/**
 * Get top N most similar diseases to the target disease
 * @param {string} targetDisease - Name of the target disease
 * @param {number} topN - Number of similar diseases to return
 * @returns {Array} - Array of {disease, similarity} objects
 */
export function getTopSimilarDiseases(targetDisease, topN = 5) {
  const scores = getAttributeSimilarityScores(targetDisease);
  
  return Object.entries(scores)
    .filter(([disease]) => disease !== targetDisease)
    .map(([disease, similarity]) => ({ 
      disease, 
      similarity: Number(similarity.toFixed(3))
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
}

/**
 * Get diseases that share specific attributes with the target
 * Useful for explaining why certain diseases are considered similar
 */
export function getDiseasesBySharedAttributes(targetDisease, attribute, value) {
  const target = DISEASE_ATTRIBUTES[targetDisease];
  if (!target) return [];
  
  const normalizedValue = normalizeText(value);
  const matches = [];
  
  Object.entries(DISEASE_ATTRIBUTES).forEach(([diseaseName, attrs]) => {
    if (diseaseName === targetDisease) return;
    
    const values = attrs[attribute] || [];
    if (values.some(v => normalizeText(v).includes(normalizedValue) || 
                         normalizedValue.includes(normalizeText(v)))) {
      matches.push(diseaseName);
    }
  });
  
  return matches;
}

/**
 * Get detailed similarity breakdown between two diseases
 * Useful for debugging and explaining results
 */
export function getSimilarityBreakdown(disease1, disease2) {
  if (disease1 === disease2) {
    return {
      disease1,
      disease2,
      overall: 1.0,
      message: "Same disease",
      matchingFeatures: []
    };
  }
  
  const attrs1 = DISEASE_ATTRIBUTES[disease1];
  const attrs2 = DISEASE_ATTRIBUTES[disease2];
  
  if (!attrs1 || !attrs2) {
    return {
      disease1,
      disease2,
      overall: 0,
      message: "Missing attribute data",
      matchingFeatures: []
    };
  }
  
  const breakdown = {
    disease1,
    disease2,
    overall: calculateSimilarity(disease1, disease2),
    category: {
      disease1: getDiseaseCategory(disease1),
      disease2: getDiseaseCategory(disease2),
      same: getDiseaseCategory(disease1) === getDiseaseCategory(disease2)
    },
    attributeSimilarity: {},
    matchingFeatures: []
  };
  
  // Calculate per-attribute similarity using ATTRIBUTE_WEIGHTS keys
  const attributes = Object.keys(ATTRIBUTE_WEIGHTS);
  
  attributes.forEach(attr => {
    const values1 = attrs1[attr] || [];
    const values2 = attrs2[attr] || [];
    
    if (values1.length > 0 && values2.length > 0) {
      const set1 = new Set(values1.map(v => normalizeText(v)));
      const set2 = new Set(values2.map(v => normalizeText(v)));
      
      const intersection = [...set1].filter(x => set2.has(x));
      const union = new Set([...set1, ...set2]).size;
      
      breakdown.attributeSimilarity[attr] = {
        similarity: union > 0 ? intersection.length / union : 0,
        matchingValues: intersection
      };
      
      // Collect matching features for display
      intersection.forEach(value => {
        breakdown.matchingFeatures.push(`${attr}: ${value}`);
      });
    } else {
      breakdown.attributeSimilarity[attr] = { similarity: 0, matchingValues: [] };
    }
  });
  
  return breakdown;
}

// Export a pre-calculated similarity matrix for frequently accessed comparisons
export const SIMILARITY_MATRIX = (() => {
  const diseases = Object.keys(DISEASE_ATTRIBUTES);
  const matrix = {};
  
  diseases.forEach(d1 => {
    matrix[d1] = {};
    diseases.forEach(d2 => {
      if (d1 === d2) {
        matrix[d1][d2] = 1.0;
      } else {
        matrix[d1][d2] = calculateSimilarity(d1, d2);
      }
    });
  });
  
  return matrix;
})();

/**
 * Quick lookup for similarity between two diseases
 * Uses pre-calculated matrix for better performance
 */
export function getSimilarity(disease1, disease2) {
  if (!disease1 || !disease2) return 0;
  if (disease1 === disease2) return 1.0;
  
  return SIMILARITY_MATRIX[disease1]?.[disease2] || 
         calculateSimilarity(disease1, disease2);
}