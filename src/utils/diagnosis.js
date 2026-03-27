// src/utils/diagnosis.js
import { DISEASES } from '../data/diseases.js';

// Flatten flat DISEASES map into an array
const DISEASE_LIST = Object.keys(DISEASES).map(id => ({
  id,
  ...DISEASES[id]
}));

export const diagnoseDisease = (userAnswers) => {
  // This is a fallback function; adaptive questionnaire is the primary path.
  const results = DISEASE_LIST.map(disease => ({
    id: disease.id,
    name: disease.displayName || disease.id.replace(/_/g, ' '),
    category: disease.category || 'UNKNOWN',
    matchPercentage: disease.confidence || 75,
    warning: disease.warning || null,
    texture: disease.texture || [],
    elevation: disease.elevation || [],
    ages: disease.ages || []
  }));

  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

export const getTopDiagnoses = (userAnswers, limit = 4) => {
  return diagnoseDisease(userAnswers).slice(0, limit);
};