import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/SelfAssessment.css';
import { DISEASES } from './ConditionAttr';
import { getPersonalizedQuestions, getTargetCategory } from './selfAssessmentQuestions'

const handleAnswer = (setAnswers, questionId, answer) => {
  setAnswers(prev => ({
    ...prev,
    [questionId]: answer
  }));
};

const ASSESSMENT_MAPPING = {
  1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 
  7: 6, 8: 7, 9: 8, 10: 9, 11: 10, 12: 11
};


const calculateArrayAverage = (arr) => {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((total, val) => total + val, 0);
  return sum / arr.length;
};

const getAnswerValue = (answer) => {
  return answer.toLowerCase().includes('yes') ? 1 : 0;
};

const calculateDiseaseAverages = (diseaseCategoryObject) => {
  if (!diseaseCategoryObject || typeof diseaseCategoryObject !== 'object') {
    return {};
  }

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


const calculateWeightedResults = (assessmentAnswers, topPredictionCondition) => {
  const results = {};

  if (!assessmentAnswers || Object.keys(assessmentAnswers).length === 0) {
    return results;
  }

  const targetCategoryKey = getTargetCategory(topPredictionCondition);
  const targetCategoryDiseases = CATEGORY_SCORE_MAP[targetCategoryKey];

  if (!targetCategoryDiseases) {
    return results;
  }

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

  return { [targetCategoryKey]: results };
};

const checkDiseaseThreshold = (scores, category = 'DEFAULT') => {
  if (!scores || Object.keys(scores).length === 0) return false;

  const threshold = CATEGORY_THRESHOLDS[category] || CATEGORY_THRESHOLDS.DEFAULT;

  const top3 = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const total = top3.reduce((sum, [, score]) => sum + score, 0);
  const filteredTop3 = top3.filter(([, score]) => score > 0);
  const filteredTotal = filteredTop3.reduce((sum, [, score]) => sum + score, 0);

  if (filteredTop3.length === 0) return false;

  for (const [disease, score] of filteredTop3) {
    const percentage = (score / filteredTotal) * 100;
    if (percentage >= threshold) {
      return true;
    }
  }

  return false;
};

function SelfAssessment() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [diseaseScores, setDiseaseScores] = useState({});
  const [autoProceed, setAutoProceed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [topPrediction, setTopPrediction] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;
  const predictions = location.state?.predictions;

  useEffect(() => {
    if (predictions) {
      const { questions: personalizedQuestions, category, topPrediction: prediction } = getPersonalizedQuestions(predictions);
      setQuestions(personalizedQuestions);
      setCurrentCategory(category);
      setTopPrediction(prediction);
    }
  }, [predictions]);

  const calculateAllDiseaseScores = (currentAnswers, topPredictionCondition) => {
    if (!currentAnswers || Object.keys(currentAnswers).length === 0) {
      return {};
    }

    const targetCategoryKey = getTargetCategory(topPredictionCondition);
    const targetCategoryDiseases = CATEGORY_SCORE_MAP[targetCategoryKey];

    if (!targetCategoryDiseases) {
      return {};
    }

    const targetDiseaseAverages = calculateDiseaseAverages(targetCategoryDiseases);
    const allScores = {};

    Object.entries(targetCategoryDiseases).forEach(([diseaseName, diseaseData]) => {
      const INITIAL_SCORE = 5;
      let totalWeight = INITIAL_SCORE;
      const { weights, attributes } = diseaseData;

      Object.entries(currentAnswers).forEach(([questionId, answer]) => {
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

      // Prevent negative base scores so downstream percentages stay non-negative
      allScores[diseaseName] = Math.max(0, totalWeight);
    });

    return allScores;
  };

  useEffect(() => {
    if (Object.keys(answers).length > 0 && topPrediction) {
      const scores = calculateAllDiseaseScores(answers, topPrediction);
      setDiseaseScores(scores);

      const targetCategory = getTargetCategory(topPrediction);
      const shouldProceed = checkDiseaseThreshold(scores, targetCategory);

      if (shouldProceed && !autoProceed) {
        setAutoProceed(true);
        // Wait a bit to show the user we detected high confidence
        setTimeout(() => handleCompletion(scores), 1500);
      }

    }
  }, [answers, topPrediction]);

  const handleAnswerInComponent = (questionId, answer) => {
    handleAnswer(setAnswers, questionId, answer);
  };

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCompletion = (preCalculatedScores = null) => {
    setIsLoading(true);

    const randomDelay = Math.random() * 4 + 1;

    setTimeout(() => {
      localStorage.setItem('assessmentAnswers', JSON.stringify(answers));
      navigate('/results', {
        state: {
          capturedImage,
          predictions,
          answers,
          diseaseScores: preCalculatedScores || diseaseScores,
          adaptive: true,
          assessmentCategory: currentCategory,
          assessmentQuestions: questions
        }
      });
    }, randomDelay * 1000);
  };

  const currentQuestion = questions[step - 1];
  const isLastQuestion = step === questions.length;

  if (questions.length === 0) {
    return (
      <div className="assessment-container">
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Loading personalized assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>
              {autoProceed
                ? "High-confidence match detected. Proceeding..."
                : "Analyzing Assessment..."
              }
            </p>
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
        <p className="assessment-note">Note: Answer every question with the best of your knowledge as this will determine the results.</p>
      </div>

      {/* Question Card */}
      <div className="assessment-card">
        <div className="progress-dots">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`dot ${i + 1 === step ? 'active' : i + 1 < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        <h2 className="question-number">Question {step}</h2>
        <h3 className="question-text">{currentQuestion?.text}</h3>

        <div className="options-grid">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${answers[currentQuestion.id] === option ? 'selected' : ''}`}
              onClick={() => handleAnswerInComponent(currentQuestion.id, option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="navigation-buttons">
          {step > 1 ? (
            <button className="nav-button prev-button" onClick={handlePrevious}>
              <FontAwesomeIcon icon={faArrowLeft} /> Previous
            </button>
          ) : (
            <div></div>
          )}
          {!isLastQuestion ? (
            <button
              className="nav-button next-button"
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              Next <FontAwesomeIcon icon={faArrowRight} />
            </button>
          ) : (
            <button
              className="nav-button complete-button"
              onClick={() => handleCompletion()}
              disabled={!answers[currentQuestion.id]}
            >
              Complete Assessment <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
        </div>
      </div>

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


// Local getTargetCategory removed, now using imported version


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