import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/SelfAssessment.css';
import { DISEASES } from './ConditionAttr';
import { CATEGORY_QUESTIONS, getTargetCategory, getTopPrediction } from './selfAssessmentQuestions';

const CATEGORY_SCORE_MAP = {
  'INFLAMMATORY': DISEASES.INFLAMMATORY,
  'INFECTIOUS': DISEASES.INFECTIOUS,
  'AUTOIMMUNE': DISEASES.AUTOIMMUNE,
  'BENIGN_GROWTH': DISEASES.BENIGN_GROWTH,
  'PIGMENTARY': DISEASES.PIGMENTARY,
  'SKIN_CANCER': DISEASES.SKIN_CANCER,
  'ENVIRONMENTAL': DISEASES.ENVIRONMENTAL,
};

const getActiveQuestions = (predictions) => {
  const topPrediction = getTopPrediction(predictions);
  const category = getTargetCategory(topPrediction);
  const questionsList = CATEGORY_QUESTIONS[category] || CATEGORY_QUESTIONS.DEFAULT;
  return questionsList.map((q, index) => ({
    ...q,
    attributeIndex: index
  }));
};

const getAnswerValue = (answer) => {
  return answer.toLowerCase().includes('yes') ? 1 : 0;
};

// Calculate current disease scores based on answers
const calculateCurrentScores = (answeredQuestions, categoryDiseases, activeQuestionsList) => {
  const scores = {};
  const INITIAL_SCORE = 5;

  if (!categoryDiseases) return {};

  Object.entries(categoryDiseases).forEach(([diseaseName, diseaseData]) => {
    let totalWeight = INITIAL_SCORE;
    const { weights, attributes } = diseaseData;

    answeredQuestions.forEach((answer, questionId) => {
      const question = activeQuestionsList.find(q => q.id === questionId);
      if (!question) return;

      const answerValue = getAnswerValue(answer);
      const attributeIndex = question.attributeIndex;

      if (weights[attributeIndex] !== undefined) {
        const characteristicValue = attributes[attributeIndex] || 0;

        if (answerValue !== characteristicValue) {
          const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
          totalWeight -= avgWeight;
        } else {
          if (answerValue === 0 && characteristicValue === 0) {
            const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
            totalWeight += avgWeight;
          } else if (answerValue === 1 && characteristicValue === 1) {
            totalWeight += weights[attributeIndex];
          }
        }
      }
    });

    scores[diseaseName] = Math.max(-10, totalWeight);
  });

  return scores;
};

// Calculate question importance based on variance in weights across diseases
const calculateQuestionImportance = (categoryDiseases, attributeIndex) => {
  if (!categoryDiseases) return 0;

  const weights = [];
  Object.values(categoryDiseases).forEach(disease => {
    if (disease.weights && disease.weights[attributeIndex] !== undefined) {
      weights.push(disease.weights[attributeIndex]);
    }
  });

  if (weights.length === 0) return 0;

  const mean = weights.reduce((a, b) => a + b, 0) / weights.length;
  const variance = weights.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / weights.length;
  const nonZeroCount = weights.filter(w => w > 0).length;
  const eliminationPower = (weights.length - nonZeroCount) / weights.length;

  return variance * 0.7 + eliminationPower * 0.3;
};

// Calculate information gain for a question
const calculateInformationGain = (question, categoryDiseases, currentScores) => {
  if (!categoryDiseases || !currentScores) return 0;
  const sortedDiseases = Object.entries(currentScores).sort((a, b) => b[1] - a[1]).slice(0, 3);
  let totalGain = 0;
  question.options.forEach(option => {
    const answerValue = getAnswerValue(option);
    let matchCount = 0;
    sortedDiseases.forEach(([diseaseName]) => {
      const disease = categoryDiseases[diseaseName];
      if (disease && disease.attributes[question.attributeIndex] === answerValue) {
        matchCount++;
      }
    });
    totalGain += matchCount / sortedDiseases.length;
  });
  return totalGain / question.options.length;
};

// Get next question using adaptive logic
const getNextQuestion = (answeredQuestions, categoryDiseases, allQuestions, currentScores) => {
  if (!allQuestions || allQuestions.length === 0) return null;
  const unansweredQuestions = allQuestions.filter(q => !answeredQuestions.has(q.id));
  if (unansweredQuestions.length === 0) return null;

  if (!categoryDiseases) return unansweredQuestions[0];

  const questionScores = unansweredQuestions.map(question => {
    const importance = calculateQuestionImportance(categoryDiseases, question.attributeIndex);
    const infoGain = calculateInformationGain(question, categoryDiseases, currentScores);
    return { question, score: importance * 0.6 + infoGain * 0.4 };
  });

  questionScores.sort((a, b) => b.score - a.score);
  return questionScores[0].question;
};

// Check if we should stop early
const shouldStopEarly = (answeredQuestions, categoryDiseases, activeQuestionsList) => {
  if (answeredQuestions.size < 3) return false;
  if (!categoryDiseases) return false;

  const scores = calculateCurrentScores(answeredQuestions, categoryDiseases, activeQuestionsList);
  const sortedScores = Object.values(scores).sort((a, b) => b - a);

  if (sortedScores.length >= 2) {
    const topScore = sortedScores[0];
    const secondScore = sortedScores[1];
    const confidenceGap = topScore - secondScore;
    if (topScore > 15 && confidenceGap > 8) return true;
  }
  return false;
};

function AdaptiveQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Analyzing image pixels...",
    "Extracting clinical features...",
    "Cross-referencing symptom data...",
    "Consulting AI knowledge base...",
    "Finalizing assessment report..."
  ];

  const [diseaseScores, setDiseaseScores] = useState({});
  const [questionHistory, setQuestionHistory] = useState([]);
  const [questions, setQuestions] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;
  const predictions = location.state?.predictions;

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Initialize
  useEffect(() => {
    const topPred = getTopPrediction(predictions);
    const category = getTargetCategory(topPred);
    const activeQs = getActiveQuestions(predictions);
    setQuestions(activeQs);

    const categoryDiseases = CATEGORY_SCORE_MAP[category];
    const firstQuestion = getNextQuestion(new Map(), categoryDiseases, activeQs, {});
    
    if (firstQuestion) {
      setCurrentQuestion(firstQuestion);
      setQuestionHistory([firstQuestion.id]);
    }
  }, [predictions]);

  // Update scores
  useEffect(() => {
    const topPred = getTopPrediction(predictions);
    const category = getTargetCategory(topPred);
    const categoryDiseases = CATEGORY_SCORE_MAP[category];

    if (categoryDiseases && answers.size > 0 && questions.length > 0) {
      const scores = calculateCurrentScores(answers, categoryDiseases, questions);
      setDiseaseScores(scores);
    }
  }, [answers, questions, predictions]);

  const handleAnswer = (questionId, answer) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, answer);
    setAnswers(newAnswers);

    const topPred = getTopPrediction(predictions);
    const category = getTargetCategory(topPred);
    const categoryDiseases = CATEGORY_SCORE_MAP[category];

    if (shouldStopEarly(newAnswers, categoryDiseases, questions)) {
      handleCompletion(newAnswers);
      return;
    }

    const currentScores = calculateCurrentScores(newAnswers, categoryDiseases, questions);
    const nextQuestion = getNextQuestion(newAnswers, categoryDiseases, questions, currentScores);

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setQuestionHistory(prev => [...prev, nextQuestion.id]);
    } else {
      handleCompletion(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop();
      const previousQuestionId = newHistory[newHistory.length - 1];
      const previousQuestion = questions.find(q => q.id === previousQuestionId);

      if (previousQuestion) {
        setCurrentQuestion(previousQuestion);
        setQuestionHistory(newHistory);
        const newAnswers = new Map(answers);
        newAnswers.delete(currentQuestion.id);
        setAnswers(newAnswers);
      }
    }
  };

  const handleCompletion = (finalAnswers = answers) => {
    setIsLoading(true);
    const answersObj = {};
    finalAnswers.forEach((v, k) => { answersObj[k] = v; });

    const topPred = getTopPrediction(predictions);
    const category = getTargetCategory(topPred);
    const categoryDiseases = CATEGORY_SCORE_MAP[category];
    const finalScores = (categoryDiseases && questions.length > 0) ? calculateCurrentScores(finalAnswers, categoryDiseases, questions) : {};

    setTimeout(() => {
      localStorage.setItem('assessmentAnswers', JSON.stringify(answersObj));
      navigate('/results', {
        state: {
          capturedImage,
          predictions,
          answers: answersObj,
          diseaseScores: finalScores,
          adaptive: true
        }
      });
    }, 2000);
  };

  if (!currentQuestion) {
    return (
      <div className="assessment-container">
        <div className="assessment-card">
          <p>Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  const currentAnswer = answers.get(currentQuestion.id);
  const isFirstQuestion = questionHistory.length === 1;
  const isLastQuestion = answers.size >= questions.length || !getNextQuestion(answers,
    CATEGORY_SCORE_MAP[getTargetCategory(getTopPrediction(predictions))] || {}, questions, diseaseScores);


  return (
    <div className="assessment-wrapper">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>SkinSight AI</div>
          <div className="nav-links">
            <a href="/#home" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
            <a href="/#about" onClick={(e) => { e.preventDefault(); navigate('/'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>About</a>
            <a href="/#how-to-use" onClick={(e) => { e.preventDefault(); navigate('/'); setTimeout(() => document.getElementById('how-to-use')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>How To Use</a>
          </div>
          <button className="btn-contact" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
            Contact Us
          </button>
        </div>
      </nav>

      <div className="assessment-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="medical-spinner-container">
                <div className="medical-spinner"></div>
                <div className="spinner-pulse"></div>
              </div>
              <p className="loading-message-text">{loadingMessages[loadingStep]}</p>
            </div>
          </div>
        )}

        <div className="assessment-card animate-fade-in">
          <div className="progress-dots">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`dot ${i + 1 === questionHistory.length ? 'active' : i + 1 < questionHistory.length ? 'completed' : ''}`}
              />
            ))}
          </div>

          <h2>Self-Assessment</h2>
          <span className="assessment-subtext">Our tools provide personalized assessments for your query.</span>

          <div className="question-section">
            <h3>{currentQuestion.text}</h3>
            <div className="options-grid">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${currentAnswer === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="navigation-buttons">
            {!isFirstQuestion ? (
              <button className="nav-button" onClick={handlePrevious}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </button>
            ) : (
              <div></div>
            )}
            {currentAnswer && isLastQuestion && (
              <button
                className="nav-button done"
                onClick={() => handleCompletion()}
              >
                Finish Assessment <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="/#about" onClick={(e) => { e.preventDefault(); navigate('/'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>About</a>
              <a href="/#how-to-use" onClick={(e) => { e.preventDefault(); navigate('/'); setTimeout(() => document.getElementById('how-to-use')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>How To Use</a>
              <button className="btn-footer-contact" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
                Contact Us
              </button>
            </div>
            <div className="footer-copyright">
              <span className="copyright-icon">👤</span>
              <span>© SkinSight AI 2025</span>
            </div>
            <div className="footer-rights">
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdaptiveQuestionnaire;
