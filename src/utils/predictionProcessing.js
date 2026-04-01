import { CONDITION_DESCRIPTIONS } from '../data/descriptions';
import { DISEASES } from '../data/diseases';
import { diagnoseAdaptive } from '../data/adaptiveQuestionnaire';
import { getTopSimilarDiseases, getSimilarity } from '../models/symptomSimilarityModel';

//Helpers

export const findConditionDescription = (diseaseName) => {
  if (!diseaseName) {
    return {
      name: 'Unknown Condition',
      description: 'Please consult a dermatologist for evaluation.',
      causes: 'Unable to determine specific causes.'
    };
  }

  if (CONDITION_DESCRIPTIONS[diseaseName]) return CONDITION_DESCRIPTIONS[diseaseName];

  const withSpaces = diseaseName.replace(/_/g, ' ');
  const match = Object.keys(CONDITION_DESCRIPTIONS).find(
    key => key.toLowerCase() === withSpaces.toLowerCase()
  );
  if (match) return CONDITION_DESCRIPTIONS[match];

  return {
    name: diseaseName.replace(/_/g, ' '),
    description: 'Please consult a dermatologist for evaluation.',
    causes: 'Clinical assessment required.'
  };
};

// ML Translation Dictionary
const ML_CLASS_MAP = {
  "acne": "Acne",
  "dermatitis": "Dermatitis",
  "molluscum contagiosum": "Molluscum_Contagiosum",
  "ringworm": "Ringworm",
  "vitiligo": "Vitiligo",
  "warts": "Warts"
};

export const normalizePredictionName = (name) => {
  if (!name) return null;
  const raw = String(name).toLowerCase().trim();
  if (ML_CLASS_MAP[raw]) return ML_CLASS_MAP[raw];

  // Fallback for unknown classes
  return name.replace(/\s+/g, '_').replace(/[.,]/g, '').trim();
};

export const formatModelPrediction = (predictionResponse) => {
  if (!predictionResponse || (!predictionResponse.success && !predictionResponse.top_prediction)) return null;
  return {
    topPrediction: normalizePredictionName(predictionResponse.top_prediction),
    confidence: Number(predictionResponse.confidence ?? 0),
    rawScores: predictionResponse.predictions || {}
  };
};

export const combinePredictions = ({ modelPrediction, assessmentAnswers, topN = 4 }) => {
  // 1. Adaptive questionnaire results
  const adaptiveResults = diagnoseAdaptive(assessmentAnswers || {});

  // Convert adaptive results, map keyed by disease id
  const surveyResults = adaptiveResults.map(r => ({
    id: r.id,
    label: r.name || r.id.replace(/_/g, ' '),
    surveyMatch: (r.confidence || 80) / 100,   // normalize to 0-1
    warning: r.warning || null,
    texture: r.texture || [],
    elevation: r.elevation || [],
    ages: r.ages || [],
    category: r.category || null
  }));

  // 2. Model top prediction
  const modelTop = modelPrediction?.topPrediction ||
    (surveyResults.length > 0 ? surveyResults[0].id : null);
  const modelScore = modelPrediction?.confidence || 0; // already 0-1

  // 3. Similarity neighbours of the model top prediction
  const similarityCandidates = modelTop ? getTopSimilarDiseases(modelTop, 10) : [];

  // Build combined scored map
  const map = new Map();

  const upsert = (id, patch) => {
    const existing = map.get(id) || {
      id,
      label: (DISEASES[id]?.displayName) || id.replace(/_/g, ' '),
      source: 'fallback',
      surveyMatch: 0,
      modelMatch: 0,
      similarityToModel: 0,
      diseaseConfidence: (DISEASES[id]?.confidence || 75) / 100
    };
    map.set(id, { ...existing, ...patch });
  };

  // Adaptive results
  surveyResults.forEach(r => {
    upsert(r.id, {
      label: r.label,
      source: 'self-assessment',
      surveyMatch: r.surveyMatch,
      warning: r.warning,
      texture: r.texture,
      elevation: r.elevation,
      ages: r.ages,
      category: r.category
    });
  });

  // Model top
  if (modelTop) {
    upsert(modelTop, {
      source: map.has(modelTop) ? 'fused' : 'model',
      modelMatch: modelScore,
      similarityToModel: 1.0
    });
  }

  // Similarity neighbours
  similarityCandidates.forEach(simItem => {
    if (!simItem.disease) return;
    upsert(simItem.disease, {
      source: map.has(simItem.disease) ? 'fused' : 'similarity',
      similarityToModel: Math.max(
        map.get(simItem.disease)?.similarityToModel || 0,
        simItem.similarity
      )
    });
  });

  //Score every candidate 
  let scoredArray = Array.from(map.values()).map(item => ({
    ...item,
    finalScore: Number(
      (
        0.60 * (item.surveyMatch || 0) +
        0.40 * (item.similarityToModel || 0)
      ).toFixed(4)
    )
  }));

  scoredArray.sort((a, b) => b.finalScore - a.finalScore);

  if (scoredArray.length < topN) {
    const existingIds = new Set(scoredArray.map(r => r.id));

    // All diseases NOT yet in the list, ranked by their model-similarity first,
    // then by disease confidence from diseases.js as tiebreaker
    const fallbackCandidates = Object.keys(DISEASES)
      .filter(id => !existingIds.has(id))
      .map(id => {
        const simScore = modelTop ? getSimilarity(id, modelTop) : 0;
        const disConf = (DISEASES[id]?.confidence || 75) / 100;
        return {
          id,
          label: DISEASES[id]?.displayName || id.replace(/_/g, ' '),
          source: 'fallback',
          surveyMatch: 0,
          modelMatch: 0,
          similarityToModel: simScore,
          diseaseConfidence: disConf,
          texture: DISEASES[id]?.texture || [],
          elevation: DISEASES[id]?.elevation || [],
          ages: DISEASES[id]?.ages || [],
          category: DISEASES[id]?.category || null,
          warning: DISEASES[id]?.warning || null,
          finalScore: Number((0.80 * simScore + 0.05 * disConf).toFixed(4))
        };
      })
      .sort((a, b) => b.finalScore - a.finalScore);

    const needed = topN - scoredArray.length;
    scoredArray = scoredArray.concat(fallbackCandidates.slice(0, needed));
  }


  const topSlice = scoredArray.slice(0, topN);

  const TEMPERATURE = 0.20;

  // Calculate exponentiated scores directly from the raw finalScore
  const expScores = topSlice.map(item => Math.exp((item.finalScore || 0) / TEMPERATURE));
  const expSum = expScores.reduce((sum, val) => sum + val, 0);

  const combinedArray = topSlice.map((item, index) => ({
    ...item,
    finalScore: expSum > 0
      ? Number((expScores[index] / expSum).toFixed(4))
      : Number((1 / topN).toFixed(4)),
    debugMath: {
      rawTotal: (item.finalScore || 0).toFixed(3),
      surveyRaw: (0.20 * (item.surveyMatch || 0)).toFixed(3),
      similarityRaw: (0.80 * (item.similarityToModel || 0)).toFixed(3)
    }
  }));

  return {
    modelPrediction,
    surveyResults,
    similarityCandidates,
    topDisease: modelTop,
    combined: combinedArray
  };
};
