import { attributes } from '../data/attributes';

/**
 * Symptom Similarity Model
 * Calculates clinical similarity between diseases based on their attributes
 * Used to boost scores for diseases with similar clinical features to the top prediction
 */

// Flatten the attributes structure for easier access
const DISEASE_ATTRIBUTES = {};

// Process the hierarchical attributes into a flat disease->attributes map
Object.values(attributes).forEach(category => {
  Object.entries(category).forEach(([diseaseName, attributeSet]) => {
    DISEASE_ATTRIBUTES[diseaseName] = attributeSet;
  });
});

// List of all diseases in the system (for debugging/validation)
export const ALL_DISEASES = Object.keys(DISEASE_ATTRIBUTES).sort();

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
  
  // Define which attributes to include and their weights
  const attributeCategories = [
    'lesionForm',
    'distribution',
    'morphology',
    'color',
    'surface',
    'sensation',
    'chronicity',
    'triggers',
    'associatedFindings',
    'demographics'
  ];
  
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
 * Calculate weighted similarity focusing on key clinical attributes
 * Different attributes have different importance in diagnosis
 */
function weightedAttributeSimilarity(disease1, disease2, weights = {
  lesionForm: 0.25,      // Most important - what the lesion looks like
  distribution: 0.20,     // Very important - where it appears
  morphology: 0.15,       // Important - specific characteristics
  color: 0.10,            // Important - color changes
  surface: 0.10,          // Surface texture
  sensation: 0.08,        // Itchiness, pain, etc.
  chronicity: 0.05,       // How long it lasts
  triggers: 0.04,         // What triggers it
  associatedFindings: 0.03 // Other related symptoms
}) {
  if (!disease1 || !disease2) return 0;
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  Object.entries(weights).forEach(([attribute, weight]) => {
    const values1 = disease1[attribute] || [];
    const values2 = disease2[attribute] || [];
    
    if (values1.length > 0 && values2.length > 0) {
      // Convert to normalized sets for comparison
      const set1 = new Set(values1.map(v => normalizeText(v)));
      const set2 = new Set(values2.map(v => normalizeText(v)));
      
      const intersection = [...set1].filter(x => set2.has(x)).length;
      const union = new Set([...set1, ...set2]).size;
      
      const similarity = union > 0 ? intersection / union : 0;
      weightedSum += similarity * weight;
      totalWeight += weight;
    }
  });
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Check if two diseases are in the same category
 * (RASH_OR_REDNESS, GROWTH_OR_LUMP, etc.)
 */
function getDiseaseCategory(diseaseName) {
  for (const [categoryName, diseases] of Object.entries(attributes)) {
    if (diseases[diseaseName]) {
      return categoryName;
    }
  }
  return null;
}

/**
 * Calculate comprehensive similarity score between two diseases
 * Combines multiple similarity metrics for better accuracy
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
 * Get similarity scores for all diseases compared to a target disease
 * @param {string} targetDisease - Name of the disease to compare against
 * @returns {Object} - Map of disease names to similarity scores (0-1)
 */
export function getAttributeSimilarityScores(targetDisease) {
  if (!targetDisease || !DISEASE_ATTRIBUTES[targetDisease]) {
    console.warn(`Target disease not found in attributes: ${targetDisease}`);
    return {};
  }
  
  const similarityScores = {};
  
  // Calculate similarity for all diseases
  Object.keys(DISEASE_ATTRIBUTES).forEach(diseaseName => {
    similarityScores[diseaseName] = calculateSimilarity(targetDisease, diseaseName);
  });
  
  return similarityScores;
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
  
  // Calculate per-attribute similarity
  const attributes = [
    'lesionForm', 'distribution', 'morphology', 'color', 
    'surface', 'sensation', 'chronicity', 'triggers'
  ];
  
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