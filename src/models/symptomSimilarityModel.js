import { DISEASES } from '../data/diseases';

const ATTRIBUTE_WEIGHTS = {
  texture: 0.40,  // rough / smooth / crust / oozing  – strongest signal
  elevation: 0.30,  // flat / raised
  ages: 0.20,  // age groups
  category: 0.10   // RASH_OR_REDNESS / GROWTH_OR_LUMP / etc.
};

const EXACT_MATCH_BOOST = 1.5;
const PARTIAL_MATCH_FACTOR = 0.7;
const DISEASE_ATTRIBUTES = {}; //flattened disease attributes

Object.entries(DISEASES || {}).forEach(([id, d]) => {
  DISEASE_ATTRIBUTES[id] = {
    texture: Array.isArray(d.texture) ? d.texture : [],
    elevation: Array.isArray(d.elevation) ? d.elevation : [],
    ages: Array.isArray(d.ages) ? d.ages : [],
    category: d.category ? [d.category] : []
  };
});

function normalizeText(text) {
  return String(text).toLowerCase().trim();
}

function jaccardSimilarity(set1, set2) {
  if (!set1 || !set2) return 0;
  if (set1.size === 0 && set2.size === 0) return 1;
  if (set1.size === 0 || set2.size === 0) return 0;
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function weightedAttributeSimilarity(attrs1, attrs2) {
  if (!attrs1 || !attrs2) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  Object.entries(ATTRIBUTE_WEIGHTS).forEach(([attribute, weight]) => {
    const values1 = attrs1[attribute] || [];
    const values2 = attrs2[attribute] || [];

    if (values1.length > 0 && values2.length > 0) {
      const set1 = new Set(values1.map(v => normalizeText(v)));
      const set2 = new Set(values2.map(v => normalizeText(v)));

      const exactMatches = [...set1].filter(x => set2.has(x)).length;
      let partialMatches = 0;
      if (exactMatches === 0) {
        [...set1].forEach(v1 => {
          [...set2].forEach(v2 => {
            if (v1.includes(v2) || v2.includes(v1)) partialMatches++;
          });
        });
      }

      let similarity = 0;
      if (exactMatches > 0) {
        similarity = Math.min(1, (exactMatches / Math.min(set1.size, set2.size)) * EXACT_MATCH_BOOST);
      } else if (partialMatches > 0) {
        similarity = (partialMatches / (set1.size + set2.size)) * PARTIAL_MATCH_FACTOR;
      }

      weightedSum += similarity * weight;
      totalWeight += weight;
    }
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

function flattenAttributesToSet(attrs) {
  const flat = [];
  Object.keys(ATTRIBUTE_WEIGHTS).forEach(key => {
    const values = attrs[key];
    if (Array.isArray(values)) {
      values.forEach(v => flat.push(`${key}:${normalizeText(v)}`));
    }
  });
  return new Set(flat);
}

function calculateSimilarity(d1Name, d2Name) {
  if (d1Name === d2Name) return 1.0;

  const attrs1 = DISEASE_ATTRIBUTES[d1Name];
  const attrs2 = DISEASE_ATTRIBUTES[d2Name];

  if (!attrs1 || !attrs2) return 0;

  const set1 = flattenAttributesToSet(attrs1);
  const set2 = flattenAttributesToSet(attrs2);
  const jaccard = jaccardSimilarity(set1, set2);
  const weighted = weightedAttributeSimilarity(attrs1, attrs2);

  // Category boost
  const cat1 = DISEASES[d1Name]?.category;
  const cat2 = DISEASES[d2Name]?.category;
  const categoryBoost = (cat1 && cat2 && cat1 === cat2) ? 0.1 : 0;

  return Math.min(1, Math.max(0, jaccard * 0.3 + weighted * 0.6 + categoryBoost));
}

export const SIMILARITY_MATRIX = (() => {
  const diseases = Object.keys(DISEASE_ATTRIBUTES);
  const matrix = {};
  diseases.forEach(d1 => {
    matrix[d1] = {};
    diseases.forEach(d2 => {
      matrix[d1][d2] = d1 === d2 ? 1.0 : calculateSimilarity(d1, d2);
    });
  });
  return matrix;
})();

export function getSimilarity(disease1, disease2) {
  if (!disease1 || !disease2) return 0;
  if (disease1 === disease2) return 1.0;
  return SIMILARITY_MATRIX[disease1]?.[disease2] ?? calculateSimilarity(disease1, disease2);
}

//Returns the top N diseases most similar to targetDisease
export function getTopSimilarDiseases(targetDisease, topN = 5) {
  const row = SIMILARITY_MATRIX[targetDisease];
  if (!row) return [];

  return Object.entries(row)
    .filter(([disease]) => disease !== targetDisease)
    .map(([disease, similarity]) => ({ disease, similarity: Number(similarity.toFixed(3)) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
}