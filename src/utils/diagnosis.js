import { DISEASES } from '../data/diseases.js';

// Flatten diseases for easier processing
const flattenDiseases = () => {
  const flat = [];
  Object.keys(DISEASES).forEach(category => {
    Object.keys(DISEASES[category]).forEach(diseaseName => {
      flat.push({
        id: diseaseName,
        category,
        ...DISEASES[category][diseaseName]
      });
    });
  });
  return flat;
};

const DISEASE_LIST = flattenDiseases();

export const diagnoseDisease = (userAnswers) => {
  const results = [];
  
  DISEASE_LIST.forEach(disease => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    let matchDetails = {};
    
    // Q1 Match
    const q1Match = disease.assessmentMapping.q1.value.includes(userAnswers.q1);
    const q1Score = q1Match ? disease.assessmentMapping.q1.weight : 0;
    totalScore += q1Score;
    maxPossibleScore += disease.assessmentMapping.q1.weight;
    matchDetails.q1 = { match: q1Match, score: q1Score, max: disease.assessmentMapping.q1.weight };
    
    // Q2 Match
    const q2Match = disease.assessmentMapping.q2.value.includes(userAnswers.q2);
    const q2Score = q2Match ? disease.assessmentMapping.q2.weight : 0;
    totalScore += q2Score;
    maxPossibleScore += disease.assessmentMapping.q2.weight;
    matchDetails.q2 = { match: q2Match, score: q2Score, max: disease.assessmentMapping.q2.weight };
    
    // Q3 Match
    const q3Match = disease.assessmentMapping.q3.value.includes(userAnswers.q3);
    const q3Score = q3Match ? disease.assessmentMapping.q3.weight : 0;
    totalScore += q3Score;
    maxPossibleScore += disease.assessmentMapping.q3.weight;
    matchDetails.q3 = { match: q3Match, score: q3Score, max: disease.assessmentMapping.q3.weight };
    
    // Q4 Match (Location)
    const q4Match = disease.assessmentMapping.q4.value.includes(userAnswers.q4);
    const q4Score = q4Match ? disease.assessmentMapping.q4.weight : 0;
    totalScore += q4Score;
    maxPossibleScore += disease.assessmentMapping.q4.weight;
    matchDetails.q4 = { match: q4Match, score: q4Score, max: disease.assessmentMapping.q4.weight };
    
    // Calculate percentage
    const matchPercentage = Math.round((totalScore / maxPossibleScore) * 100);
    
    // Get top matching attributes for display
    const matchingAttributes = [];
    Object.keys(disease.attributes).forEach(attr => {
      if (disease.attributes[attr].value.some(v => 
        userAnswers[attr] ? userAnswers[attr].includes(v) : false
      )) {
        matchingAttributes.push(attr);
      }
    });
    
    results.push({
      id: disease.id,
      name: disease.id.replace(/_/g, ' '),
      category: disease.category.replace(/_/g, ' '),
      matchPercentage,
      prevalence: disease.prevalence,
      demographics: disease.demographics,
      keyFeatures: {
        lesionForm: disease.attributes.lesionForm.value.slice(0, 3),
        distribution: disease.attributes.distribution.value.slice(0, 3),
        sensation: disease.attributes.sensation.value
      },
      matchDetails,
      matchingAttributes: matchingAttributes.slice(0, 5)
    });
  });
  
  // Sort by match percentage (highest first)
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

export const getTopDiagnoses = (userAnswers, limit = 5) => {
  const results = diagnoseDisease(userAnswers);
  return results.slice(0, limit);
};