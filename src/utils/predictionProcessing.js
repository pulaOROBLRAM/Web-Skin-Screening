// src/utils/predictionProcessing.js
import { CONDITION_DESCRIPTIONS } from '../data/descriptions';
import { getTopDiagnoses } from './diagnosis';
import { getTopSimilarDiseases, getSimilarity } from '../models/symptomSimilarityModel';

export const findConditionDescription = (diseaseName) => {
  if (!diseaseName) {
    return {
      name: 'Unknown Condition',
      description: 'Please consult a dermatologist for evaluation.',
      causes: 'Unable to determine specific causes.'
    };
  }

  // Try direct match
  if (CONDITION_DESCRIPTIONS[diseaseName]) {
    return CONDITION_DESCRIPTIONS[diseaseName];
  }
  
  // Try with underscores replaced by spaces
  const withSpaces = diseaseName.replace(/_/g, ' ');
  const match = Object.keys(CONDITION_DESCRIPTIONS).find(
    key => key.toLowerCase() === withSpaces.toLowerCase()
  );
  
  if (match) {
    return CONDITION_DESCRIPTIONS[match];
  }
  
  // Return default
  return {
    name: diseaseName.replace(/_/g, ' '),
    description: 'Please consult a dermatologist for evaluation.',
    causes: 'Clinical assessment required.'
  };
};

export const normalizePredictionName = (name) => name?.replace(/\s+/g, '_').replace(/[.,]/g, '').trim();

export const formatModelPrediction = (predictionResponse) => {
  if (!predictionResponse || !predictionResponse.success) {
    return null;
  }
  return {
    topPrediction: normalizePredictionName(predictionResponse.top_prediction),
    confidence: Number(predictionResponse.confidence ?? 0),
    rawScores: predictionResponse.predictions || {}
  };
};

export const combinePredictions = ({ modelPrediction, assessmentAnswers, topN = 5 }) => {
  const surveyResults = getTopDiagnoses(assessmentAnswers || {}, topN);

  const modelTop = modelPrediction?.topPrediction || surveyResults[0]?.id;

  const modelScore = (modelPrediction?.confidence || 0);
  const surveyScore = (surveyResults[0]?.matchPercentage || 0) / 100;

  const similarityCandidates = modelTop ? getTopSimilarDiseases(modelTop, topN) : [];

  const combinedList = new Map();

  // Start with survey-based
  surveyResults.forEach((item) => {
    const id = item.id;
    combinedList.set(id, {
      id,
      label: id.replace(/_/g, ' '),
      source: 'self-assessment',
      surveyMatch: item.matchPercentage / 100,
      modelMatch: 0,
      similarityToModel: modelTop ? getSimilarity(id, modelTop) : 0,
      score: (item.matchPercentage / 100) * 0.65
    });
  });

  // Add model top prediction and neighbors
  if (modelTop) {
    const modelCandidate = {
      id: modelTop,
      label: modelTop.replace(/_/g, ' '),
      source: 'model',
      surveyMatch: 0,
      modelMatch: modelScore,
      similarityToModel: 1,
      score: modelScore * 0.85
    };
    combinedList.set(modelTop, {
      ...combinedList.get(modelTop),
      ...modelCandidate,
      score: Math.max(combinedList.get(modelTop)?.score || 0, modelCandidate.score)
    });

    similarityCandidates.forEach((simItem) => {
      if (!simItem.disease) return;
      const key = simItem.disease;
      const existing = combinedList.get(key) || {
        id: key,
        label: key.replace(/_/g, ' '),
        source: 'similarity',
        surveyMatch: 0,
        modelMatch: 0,
        similarityToModel: simItem.similarity,
        score: 0
      };

      const merged = {
        ...existing,
        similarityToModel: Math.max(existing.similarityToModel || 0, simItem.similarity),
        score: Math.max(existing.score || 0, simItem.similarity * 0.65)
      };
      combinedList.set(key, merged);
    });
  }

  // Convert, score, sort, and take topN
  const scoredArray = Array.from(combinedList.values())
    .map((item) => ({
      ...item,
      source: 'fused',
      finalScore: Number((item.score + (item.surveyMatch || 0) * 0.25 + (item.modelMatch || 0) * 0.15).toFixed(3)),
      explanation: {
        surveyMatch: item.surveyMatch || 0,
        modelMatch: item.modelMatch || 0,
        similarityToModel: item.similarityToModel || 0
      }
    }))
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, topN);

  const totalFinal = scoredArray.reduce((sum, item) => sum + item.finalScore, 0);

  const combinedArray = scoredArray.map((item) => ({
    ...item,
    finalScore: totalFinal > 0 ? Number((item.finalScore / totalFinal).toFixed(4)) : 0
  }));

  return {
    modelPrediction,
    surveyResults,
    similarityCandidates,
    topDisease: modelTop,
    combined: combinedArray
  };
};
