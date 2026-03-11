import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faHome, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/SelfAssessment.css';
import { DISEASES } from '../data/diseases';
import {
  TRIAGE_QUESTIONS,
  resolveCategory,
  getQuestionsForCategory,
  getTopPrediction,
  getTargetCategory,
  TRIAGE_SCORING_FILTERS
} from './selfAssessmentQuestions';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const handleAnswer = (setAnswers, questionId, answer) => {
  setAnswers(prev => ({ ...prev, [questionId]: answer }));
};

const ASSESSMENT_MAPPING = {
  1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5,
  7: 6, 8: 7, 9: 8, 10: 9, 11: 10, 12: 11
};

const calculateArrayAverage = (arr) => {
  if (arr.length === 0) return 0;
  return arr.reduce((total, val) => total + val, 0) / arr.length;
};

const getAnswerValue = (answer) => {
  return answer.toLowerCase().includes('yes') ? 1 : 0;
};

const calculateDiseaseAverages = (diseaseCategoryObject) => {
  if (!diseaseCategoryObject || typeof diseaseCategoryObject !== 'object') return {};
  const DISEASE_AVERAGES = {};
  for (const [disease, data] of Object.entries(diseaseCategoryObject)) {
    if (data && data.weights && Array.isArray(data.weights)) {
      DISEASE_AVERAGES[disease] = calculateArrayAverage(data.weights);
    }
  }
  return DISEASE_AVERAGES;
};

const CATEGORY_SCORE_MAP = {
  'INFLAMMATORY': DISEASES.INFLAMMATORY,
  'INFECTIOUS': DISEASES.INFECTIOUS,
  'AUTOIMMUNE': DISEASES.AUTOIMMUNE,
  'BENIGN_GROWTH': DISEASES.BENIGN_GROWTH,
  'PIGMENTARY': DISEASES.PIGMENTARY,
  'SKIN_CANCER': DISEASES.SKIN_CANCER,
  'ENVIRONMENTAL': DISEASES.ENVIRONMENTAL,
};

const CATEGORY_THRESHOLDS = {
  'INFLAMMATORY': 45,
  'INFECTIOUS': 35,
  'AUTOIMMUNE': 45,
  'BENIGN_GROWTH': 40,
  'PIGMENTARY': 38,
  'SKIN_CANCER': 60,
  'ENVIRONMENTAL': 30,
  'DEFAULT': 40
};

const calculateWeightedResults = (assessmentAnswers, categoryKey) => {
  const results = {};
  if (!assessmentAnswers || Object.keys(assessmentAnswers).length === 0) return results;

  const targetCategoryDiseases = CATEGORY_SCORE_MAP[categoryKey];
  if (!targetCategoryDiseases) return results;

  const targetDiseaseAverages = calculateDiseaseAverages(targetCategoryDiseases);

  Object.entries(targetCategoryDiseases).forEach(([diseaseName, diseaseData]) => {
    let totalWeight = 0;
    const { weights, attributes } = diseaseData;

    Object.entries(assessmentAnswers).forEach(([questionId, answer]) => {
      const qId = parseInt(questionId);
      const answerValue = getAnswerValue(answer);
      const attributeIndex = ASSESSMENT_MAPPING[qId];

      if (attributeIndex !== undefined && weights[attributeIndex] !== undefined) {
        const characteristicValue = attributes[attributeIndex] || 0;
        if (answerValue !== characteristicValue) {
          totalWeight -= targetDiseaseAverages[diseaseName];
        } else {
          if (answerValue === 0 && characteristicValue === 0) {
            totalWeight += targetDiseaseAverages[diseaseName];
          } else if (answerValue === 1 && characteristicValue === 1) {
            totalWeight += weights[attributeIndex];
          }
        }
      }
    });
    results[diseaseName] = Math.max(0, totalWeight);
  });

  return { [categoryKey]: results };
};

const checkDiseaseThreshold = (scores, category = 'DEFAULT') => {
  if (!scores || Object.keys(scores).length === 0) return false;
  const threshold = CATEGORY_THRESHOLDS[category] || CATEGORY_THRESHOLDS.DEFAULT;
  const top3 = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const filteredTop3 = top3.filter(([, score]) => score > 0);
  const filteredTotal = filteredTop3.reduce((sum, [, score]) => sum + score, 0);
  if (filteredTop3.length === 0) return false;
  for (const [, score] of filteredTop3) {
    const percentage = (score / filteredTotal) * 100;
    if (percentage >= threshold) return true;
  }
  return false;
};

// ─────────────────────────────────────────────────────────────────────────────
// PHASES
// ─────────────────────────────────────────────────────────────────────────────
const PHASE = {
  TRIAGE: 'triage',       // Phase 1: Universal gateway questions
  TRANSITION: 'transition', // Brief loading screen between phases
  DEEP_DIVE: 'deep_dive', // Phase 2: Category-specific questions
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function SelfAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;
  const predictions   = location.state?.predictions;

  // Phase state
  const [phase, setPhase] = useState(PHASE.TRIAGE);
  const [step, setStep]   = useState(0); // index within current question list

  // Answers
  const [triageAnswers, setTriageAnswers] = useState({});
  const [deepAnswers, setDeepAnswers]     = useState({});

  // Resolved deep-dive questions + category
  const [deepQuestions, setDeepQuestions]       = useState([]);
  const [currentCategory, setCurrentCategory]   = useState('');
  const [topPrediction, setTopPrediction]       = useState('');

  // Scoring
  const [diseaseScores, setDiseaseScores] = useState({});
  const [autoProceed, setAutoProceed]     = useState(false);
  const [isLoading, setIsLoading]         = useState(false);

  // Derive AI top prediction on mount
  useEffect(() => {
    if (predictions) {
      setTopPrediction(getTopPrediction(predictions));
    }
  }, [predictions]);

  // ── Triage handlers ──────────────────────────────────────────────────────
  const currentTriageQ = TRIAGE_QUESTIONS[step];
  const isLastTriageQ  = step === TRIAGE_QUESTIONS.length - 1;

  const handleTriageAnswer = (qId, answer) => {
    setTriageAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleTriageNext = () => {
    if (step < TRIAGE_QUESTIONS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleTriagePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleTriageComplete = () => {
    // Resolve category from triage answers + AI hint
    const resolved = resolveCategory(triageAnswers, topPrediction);
    const questions = getQuestionsForCategory(resolved);
    
    setCurrentCategory(resolved);
    
    // Calculate initial scores based on Triage only
    const initialScores = calculateAllDiseaseScores({}, resolved, triageAnswers);
    setDiseaseScores(initialScores);

    // Check if Triage alone hit the threshold
    const shouldProceed = checkDiseaseThreshold(initialScores, resolved);
    
    if (shouldProceed) {
      setPhase(PHASE.TRANSITION);
      setAutoProceed(true);
      setTimeout(() => handleCompletion(initialScores), 2000);
      return;
    }

    // Otherwise, prepare adaptive questions for Phase 2
    // We sort questions so those relevant to the current top suspect appear first
    const prioritizedQuestions = sortQuestionsByRelevance(questions, initialScores, resolved);
    setDeepQuestions(prioritizedQuestions);
    setStep(0);
    setPhase(PHASE.TRANSITION);

    // Show brief transition screen then enter deep-dive
    setTimeout(() => {
      setPhase(PHASE.DEEP_DIVE);
    }, 2000);
  };

  // Helper to sort questions by their impact on top scoring diseases
  const sortQuestionsByRelevance = (questions, currentScores, category) => {
    if (!currentScores || Object.keys(currentScores).length === 0) return questions;
    
    // Find the top 2 suspect diseases
    const topDiseases = Object.entries(currentScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(entry => entry[0]);

    const targetCategoryDiseases = CATEGORY_SCORE_MAP[category];
    
    return [...questions].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      topDiseases.forEach(dName => {
        const dData = targetCategoryDiseases[dName];
        if (!dData) return;
        
        const idxA = ASSESSMENT_MAPPING[a.id];
        const idxB = ASSESSMENT_MAPPING[b.id];

        if (idxA !== undefined && dData.weights[idxA] > 0) scoreA += dData.weights[idxA];
        if (idxB !== undefined && dData.weights[idxB] > 0) scoreB += dData.weights[idxB];
      });

      return scoreB - scoreA; // Descending impact
    });
  };

  // ── Deep-dive handlers ───────────────────────────────────────────────────
  const currentDeepQ  = deepQuestions[step];
  const isLastDeepQ   = step === deepQuestions.length - 1;

  const handleDeepAnswer = (qId, answer) => {
    setDeepAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleDeepNext = () => {
    if (step < deepQuestions.length - 1) setStep(step + 1);
  };

  const handleDeepPrev = () => {
    if (step > 0) setStep(step - 1);
  };

  // Recalculate scores as deep answers change
  const calculateAllDiseaseScores = (currentDeepAnswers, categoryKey, triageData = null) => {
    const activeTriage = triageData || triageAnswers;
    const targetCategoryDiseases = CATEGORY_SCORE_MAP[categoryKey];
    if (!targetCategoryDiseases) return {};

    const targetDiseaseAverages = calculateDiseaseAverages(targetCategoryDiseases);
    const allScores = {};

    Object.entries(targetCategoryDiseases).forEach(([diseaseName, diseaseData]) => {
      const BASE_SCORE = 5;
      let totalWeight = BASE_SCORE;
      
      // 1. Apply Triage Scoring (Phase 1 impact)
      Object.entries(activeTriage).forEach(([tId, answer]) => {
        const filter = TRIAGE_SCORING_FILTERS[tId];
        if (filter && filter[answer]) {
          const { categories, weight } = filter[answer];
          // If this triage answer supports this disease's category, add weight
          if (categories.includes(categoryKey)) {
            totalWeight += weight;
          }
        }
      });

      const { weights, attributes } = diseaseData;

      // 2. Apply Deep-Dive Scoring (Phase 2 impact)
      Object.entries(currentDeepAnswers).forEach(([questionId, answer]) => {
        if (isNaN(questionId)) return;

        const qId = parseInt(questionId);
        const answerValue = getAnswerValue(answer);
        const attributeIndex = ASSESSMENT_MAPPING[qId];

        if (attributeIndex !== undefined && weights[attributeIndex] !== undefined) {
          const characteristicValue = attributes[attributeIndex] || 0;
          if (answerValue !== characteristicValue) {
            totalWeight -= targetDiseaseAverages[diseaseName];
          } else {
            if (answerValue === 0 && characteristicValue === 0) {
              totalWeight += targetDiseaseAverages[diseaseName] * 0.5; // Slight boost for matching absence
            } else if (answerValue === 1 && characteristicValue === 1) {
              totalWeight += weights[attributeIndex];
            }
          }
        }
      });

      allScores[diseaseName] = Math.max(0, totalWeight);
    });

    return allScores;
  };

  useEffect(() => {
    if (phase !== PHASE.DEEP_DIVE) return;
    if (Object.keys(deepAnswers).length > 0 && currentCategory) {
      const scores = calculateAllDiseaseScores(deepAnswers, currentCategory);
      setDiseaseScores(scores);

      const shouldProceed = checkDiseaseThreshold(scores, currentCategory);
      if (shouldProceed && !autoProceed) {
        setAutoProceed(true);
        setTimeout(() => handleCompletion(scores), 1500);
      }
    }
  }, [deepAnswers, currentCategory, phase]);

  const handleCompletion = (preCalculatedScores = null) => {
    setIsLoading(true);
    const delay = Math.random() * 3 + 1;
    const allAnswers = { ...triageAnswers, ...deepAnswers };

    setTimeout(() => {
      localStorage.setItem('assessmentAnswers', JSON.stringify(allAnswers));
      navigate('/results', {
        state: {
          capturedImage,
          predictions,
          answers: allAnswers,
          triageAnswers,
          deepAnswers,
          diseaseScores: preCalculatedScores || diseaseScores,
          adaptive: true,
          assessmentCategory: currentCategory,
          assessmentQuestions: deepQuestions
        }
      });
    }, delay * 1000);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="assessment-container">
      {/* Global loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>{autoProceed ? "High-confidence match detected. Proceeding..." : "Analyzing Assessment..."}</p>
          </div>
        </div>
      )}

      {/* Home Button */}
      <button className="home-button" onClick={() => navigate('/')}>
        <FontAwesomeIcon icon={faHome} /> Home
      </button>

      {/* Header */}
      <div className="assessment-header">
        <h1 className="assessment-title">Self-Assessment</h1>
        <p className="assessment-note">
          {phase === PHASE.TRIAGE
            ? "Answer these brief questions so we can personalize the next set for you."
            : "Answer every question with the best of your knowledge as this will determine the results."}
        </p>
      </div>

      {/* ── PHASE 1: TRIAGE ── */}
      {phase === PHASE.TRIAGE && (
        <div className="assessment-card">
          {/* Phase label */}
          <div className="phase-badge">
            <FontAwesomeIcon icon={faStethoscope} /> Step 1 of 2 — Initial Triage
          </div>

          <div className="progress-dots">
            {TRIAGE_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`dot ${i === step ? 'active' : i < step ? 'completed' : ''}`}
              />
            ))}
          </div>

          <h2 className="question-number">Question {step + 1}</h2>
          <h3 className="question-text">{currentTriageQ?.text}</h3>

          <div className="options-grid">
            {currentTriageQ?.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-button ${triageAnswers[currentTriageQ.id] === option ? 'selected' : ''}`}
                onClick={() => handleTriageAnswer(currentTriageQ.id, option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="navigation-buttons">
            {step > 0 ? (
              <button className="nav-button prev-button" onClick={handleTriagePrev}>
                <FontAwesomeIcon icon={faArrowLeft} /> Previous
              </button>
            ) : <div />}

            {!isLastTriageQ ? (
              <button
                className="nav-button next-button"
                onClick={handleTriageNext}
                disabled={!triageAnswers[currentTriageQ?.id]}
              >
                Next <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button
                className="nav-button complete-button"
                onClick={handleTriageComplete}
                disabled={!triageAnswers[currentTriageQ?.id]}
              >
                Continue <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TRANSITION SCREEN ── */}
      {phase === PHASE.TRANSITION && (
        <div className="assessment-card transition-card">
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
          <h2 className="transition-title">Personalizing your assessment...</h2>
          <p className="transition-text">
            Based on your answers, we're loading the most relevant questions for your condition.
          </p>
        </div>
      )}

      {/* ── PHASE 2: DEEP-DIVE ── */}
      {phase === PHASE.DEEP_DIVE && currentDeepQ && (
        <div className="assessment-card">
          {/* Phase label */}
          <div className="phase-badge phase-badge--deep">
            <FontAwesomeIcon icon={faStethoscope} /> Step 2 of 2 — Detailed Questions
          </div>

          <div className="progress-dots">
            {deepQuestions.map((_, i) => (
              <div
                key={i}
                className={`dot ${i === step ? 'active' : i < step ? 'completed' : ''}`}
              />
            ))}
          </div>

          <h2 className="question-number">Question {step + 1}</h2>
          <h3 className="question-text">{currentDeepQ?.text}</h3>

          <div className="options-grid">
            {currentDeepQ?.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-button ${deepAnswers[currentDeepQ.id] === option ? 'selected' : ''}`}
                onClick={() => handleDeepAnswer(currentDeepQ.id, option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="navigation-buttons">
            {step > 0 ? (
              <button className="nav-button prev-button" onClick={handleDeepPrev}>
                <FontAwesomeIcon icon={faArrowLeft} /> Previous
              </button>
            ) : <div />}

            {!isLastDeepQ ? (
              <button
                className="nav-button next-button"
                onClick={handleDeepNext}
                disabled={!deepAnswers[currentDeepQ?.id]}
              >
                Next <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <button
                className="nav-button complete-button"
                onClick={() => handleCompletion()}
                disabled={!deepAnswers[currentDeepQ?.id]}
              >
                Complete Assessment <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="assessment-footer">
        <div className="footer-left">
          <h3>SkinSight AI</h3>
          <p>Empower Your Skin Health Journey. Trusted skin health journey since 2025</p>
        </div>
        <div className="footer-right">
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#how-to-use">How To Use</a>
            <button className="footer-contact-btn" onClick={() => navigate('/')}>Contact Us</button>
          </div>
          <p className="footer-copyright">© 2025 SkinSight AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default SelfAssessment;
export {
  DISEASES,
  ASSESSMENT_MAPPING,
  getAnswerValue,
  calculateArrayAverage,
  handleAnswer,
  calculateDiseaseAverages,
  calculateWeightedResults,
  getTargetCategory,
  checkDiseaseThreshold,
  CATEGORY_THRESHOLDS
};