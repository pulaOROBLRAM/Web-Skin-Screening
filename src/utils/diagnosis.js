import { DISEASES } from '../data/assessmentData';

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
 * Diagnose using only self-assessment scoring (no model involvement).
 *
 * @param {Object} params
 * @param {Object} params.answers - Self-assessment answers like { q1: 'a', q2: 'b', q3: 'c', q4: 'd' }
 * @param {number} [params.topN=4] - Number of results
 * @param {string} [params.topPredictionDisease] - Optional “top prediction” disease name to use for similarity boosting
 * @param {number} [params.similarityBoost=0.15] - Strength of similarity-based boosting (0 disables)
 * @returns {Array<{disease: string, percentage: number, score: number, assessmentScore: number, similarityToTop?: number}>}
 */
export function diagnose({
  answers,
  topN = 4,
  topPredictionDisease,
  similarityBoost = 0.15
}) {
  // 1) Base scoring from self-assessment answers
  const diseaseRulesByName = flattenDiseaseMatrix();
  const haveAnswers = answers && Object.keys(answers).length > 0;

  const candidates = haveAnswers ? Object.keys(diseaseRulesByName) : [];
  const baseRows = candidates.map((diseaseName) => {
    const ruleSet = diseaseRulesByName[diseaseName];
    const assessmentScore = scoreDiseaseFromAnswers(ruleSet, answers);

    // Normalize into ~0..1 using a practical max (4 questions × 10 weight).
    const assessmentNorm = assessmentScore / 40;
    const finalScore = haveAnswers ? assessmentNorm : 0;

    return {
      disease: diseaseName,
      score: finalScore,
      assessmentScore
    };
  });

  // 2) Optional similarity boosting: “if top prediction = [disease], boost diseases with similar symptoms”
  const topDisease =
    (typeof topPredictionDisease === 'string' && topPredictionDisease.trim())
      ? topPredictionDisease.trim()
      : (baseRows.slice().sort((a, b) => b.score - a.score)[0]?.disease || '');

  const doBoost = similarityBoost > 0 && topDisease && diseaseRulesByName[topDisease];
  const topVec = doBoost ? toVector(diseaseRulesByName[topDisease]) : null;

  const rows = baseRows.map((row) => {
    if (!doBoost) return row;
    if (row.disease === topDisease) return { ...row, similarityToTop: 1 };

    const sim = cosineSimilarity(toVector(diseaseRulesByName[row.disease]), topVec);
    const boostedScore = row.score + (sim * similarityBoost);

    return {
      ...row,
      score: boostedScore,
      similarityToTop: Number(sim.toFixed(3))
    };
  });

  const ranked = rows
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, topN));

  const total = ranked.reduce((sum, r) => sum + r.score, 0);
  return ranked.map((r) => ({
    disease: r.disease,
    score: r.score,
    assessmentScore: r.assessmentScore,
    ...(typeof r.similarityToTop === 'number' ? { similarityToTop: r.similarityToTop } : {}),
    percentage: Number((total > 0 ? (r.score / total) * 100 : 0).toFixed(0))
  }));
}

