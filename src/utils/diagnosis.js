import { DISEASES } from '../data/assessmentData';
import { getAttributeSimilarityScores } from '../models/symptomSimilarityModel';

// --- Data prep ---------------------------------------------------------------
// Flatten DISEASES categories into a single { [diseaseName]: ruleSet } map.
function flattenDiseaseMatrix() {
  const flat = {};
  Object.values(DISEASES || {}).forEach((group) => {
    Object.entries(group || {}).forEach(([diseaseName, ruleSet]) => {
      flat[diseaseName] = ruleSet;
    });
  });
  return flat;
}

const QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4'];
const ANSWER_KEYS = ['a', 'b', 'c', 'd'];

// Convert a disease rule-set into a fixed-length numeric vector for similarity.
function toVector(ruleSet) {
  const vec = [];
  QUESTION_KEYS.forEach((q) => {
    ANSWER_KEYS.forEach((a) => {
      const v = ruleSet?.[q]?.[a];
      vec.push(typeof v === 'number' ? v : 0);
    });
  });
  return vec;
}

// Cosine similarity for comparing symptom-weight profiles.
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0;  
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// --- Scoring -----------------------------------------------------------------
// Sum weights for the user-selected answer choices.
function scoreDiseaseFromAnswers(ruleSet, answers) {
  if (!ruleSet || !answers) return 0;
  let score = 0;
  Object.entries(answers).forEach(([qKey, answerKey]) => {
    const qRules = ruleSet[qKey];
    if (!qRules) return;
    const weight = qRules?.[answerKey];
    if (typeof weight === 'number') score += weight;
  });
  return score;
}

/**
 * Diagnose using self-assessment scoring with attribute-based similarity boost
 *
 * @param {Object} params
 * @param {Object} params.answers - Self-assessment answers like { q1: 'a', q2: 'b', q3: 'c', q4: 'd' }
 * @param {number} [params.topN=4] - Number of results
 * @param {string} [params.topPredictionDisease] - Optional “top prediction” disease name
 * @param {number} [params.similarityBoost=0.2] - Strength of attribute-based similarity boosting
 * @param {boolean} [params.useAttributeSimilarity=true] - Use attribute-based similarity instead of cosine
 * @returns {Array<{disease: string, percentage: number, score: number, assessmentScore: number, similarityToTop?: number}>}
 */
export function diagnose({
  answers,
  topN = 4,
  topPredictionDisease,
  similarityBoost = 0.2,
  useAttributeSimilarity = true
}) {
  // 1) Base scoring from self-assessment answers
  const diseaseRulesByName = flattenDiseaseMatrix();
  const haveAnswers = answers && Object.keys(answers).length > 0;

  const candidates = haveAnswers ? Object.keys(diseaseRulesByName) : [];
  const baseRows = candidates.map((diseaseName) => {
    const ruleSet = diseaseRulesByName[diseaseName];
    const assessmentScore = scoreDiseaseFromAnswers(ruleSet, answers);

    // Normalize into ~0..1 using a practical max (4 questions × 10 weight)
    const assessmentNorm = assessmentScore / 40;
    const finalScore = haveAnswers ? assessmentNorm : 0;

    return {
      disease: diseaseName,
      score: finalScore,
      assessmentScore
    };
  });

  // 2) Determine top prediction if not provided
  const topDisease = topPredictionDisease || 
    (baseRows.slice().sort((a, b) => b.score - a.score)[0]?.disease || '');

  // 3) Get similarity scores based on method
  let similarityScores = {};
  
  if (useAttributeSimilarity) {
    // Use clinical attribute-based similarity
    similarityScores = getAttributeSimilarityScores(topDisease);
  } else {
    // Fall back to original cosine similarity method
    const doBoost = similarityBoost > 0 && topDisease && diseaseRulesByName[topDisease];
    const topVec = doBoost ? toVector(diseaseRulesByName[topDisease]) : null;
    
    baseRows.forEach(row => {
      if (row.disease === topDisease) {
        similarityScores[row.disease] = 1;
      } else if (doBoost) {
        similarityScores[row.disease] = cosineSimilarity(
          toVector(diseaseRulesByName[row.disease]), 
          topVec
        );
      } else {
        similarityScores[row.disease] = 0;
      }
    });
  }

  // 4) Apply similarity boost to scores
  const rows = baseRows.map((row) => {
    const similarity = similarityScores[row.disease] || 0;
    const boostedScore = row.score + (similarity * similarityBoost);
    
    return {
      ...row,
      score: boostedScore,
      similarityToTop: Number(similarity.toFixed(3))
    };
  });

  // 5) Rank and return results
  const ranked = rows
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, topN));

  const total = ranked.reduce((sum, r) => sum + r.score, 0);
  
  return ranked.map((r) => ({
    disease: r.disease,
    score: r.score,
    assessmentScore: r.assessmentScore,
    similarityToTop: r.similarityToTop,
    percentage: Number((total > 0 ? (r.score / total) * 100 : 0).toFixed(0))
  }));
}

// Optional: Export a function that only uses attribute similarity
export function diagnoseWithAttributeSimilarity(answers, topN = 4) {
  return diagnose({
    answers,
    topN,
    useAttributeSimilarity: true,
    similarityBoost: 0.25 // Slightly higher boost for attribute-based similarity
  });
}