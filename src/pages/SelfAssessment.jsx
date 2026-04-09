import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADAPTIVE_QUESTIONS } from '../data/adaptiveQuestionnaire';
import './css/SelfAssessment.css';

function SelfAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;
  const modelPrediction = location.state?.modelPrediction || null;

  // Adaptive questionnaire state
  const [currentQuestion, setCurrentQuestion] = useState(ADAPTIVE_QUESTIONS.q1);
  const [answers, setAnswers] = useState({});
  const [questionHistory, setQuestionHistory] = useState(['q1']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  if (!capturedImage) {
    return (
      <div className="assessment-container">
        <div className="assessment-card">
          <h1 className="assessment-title">Self-Assessment</h1>
          <p className="assessment-note">No analysis data found. Please upload an image first.</p>
          <button className="nav-button complete-button" onClick={() => navigate('/upload')}>
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  // Handle answer selection
  const handleSelect = (choiceKey) => {
    const newAnswers = { ...answers, [currentQuestion.id]: choiceKey };
    setAnswers(newAnswers);

    const option = currentQuestion.options[choiceKey];
    if (option) {
      // If this leads to a disease, we're done
      if (option.disease) {
        handleComplete(newAnswers);
        return;
      }

      // If there's a next question, navigate to it
      if (option.nextQuestion) {
        const nextContainer = ADAPTIVE_QUESTIONS[option.nextQuestion];
        if (nextContainer) {
          // Find the question object within the container
          const questionKeys = Object.keys(nextContainer).filter(key => key.startsWith('q'));
          const nextQuestion = questionKeys.length > 0 ? nextContainer[questionKeys[0]] : nextContainer;
          
          if (nextQuestion && nextQuestion.id) {
            setCurrentQuestion(nextQuestion);
            setQuestionHistory([...questionHistory, nextQuestion.id]);
          } else {
            // No valid next question, complete assessment
            handleComplete(newAnswers);
          }
        } else {
          // No more questions, complete assessment
          handleComplete(newAnswers);
        }
      } else {
        // No next question, complete assessment
        handleComplete(newAnswers);
      }
    }
  };

  // Handle going back to previous question
  const handlePrev = () => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop(); // Remove current
      const prevQuestionId = newHistory[newHistory.length - 1];
      
      // Find the previous question by traversing the structure
      const prevQuestion = findQuestionById(prevQuestionId);

      if (prevQuestion) {
        setCurrentQuestion(prevQuestion);
        setQuestionHistory(newHistory);

        // Remove the answer for the current question we're going back from
        const newAnswers = { ...answers };
        delete newAnswers[currentQuestion.id];
        setAnswers(newAnswers);
      }
    }
  };

  // Helper to find question by ID in the adaptive structure
  const findQuestionById = (targetId) => {
    // Search through all containers in ADAPTIVE_QUESTIONS
    for (const containerKey in ADAPTIVE_QUESTIONS) {
      const container = ADAPTIVE_QUESTIONS[containerKey];
      
      // Check if container is a direct question
      if (container.id === targetId) {
        return container;
      }
      
      // Check nested questions
      for (const key in container) {
        if (typeof container[key] === 'object' && container[key] && container[key].id === targetId) {
          return container[key];
        }
      }
    }
    return null;
  };

  // Complete assessment and navigate to results
  const handleComplete = (finalAnswers) => {
    setIsAnalyzing(true);
    setError(null);

    // Save answers for local persistence + review
    localStorage.setItem('assessmentAnswers', JSON.stringify(finalAnswers));
    localStorage.setItem('lastCapturedImage', capturedImage || '');
    localStorage.setItem('lastModelPrediction', JSON.stringify(modelPrediction));

    navigate('/results', {
      state: {
        capturedImage,
        answers: finalAnswers,
        modelPrediction
      }
    });

    setIsAnalyzing(false);
  };

  const options = Object.entries(currentQuestion.options || {});
  const selected = answers[currentQuestion.id];
  const canGoBack = questionHistory.length > 1;

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <h1 className="assessment-title">Self-Assessment</h1>
        <p className="assessment-note">Question {questionHistory.length}</p>
        {error && <div className="assessment-error">{error}</div>}
        {isAnalyzing && <div className="assessment-loading">Analyzing image via ML model... please wait.</div>}

        <h3 className="question-text">{currentQuestion.text}</h3>

        <div className="options-grid">
          {options.map(([k, option]) => (
            <button
              key={k}
              className={`option-button ${selected === k ? 'selected' : ''}`}
              onClick={() => handleSelect(k)}
            >
              {option.text}
            </button>
          ))}
        </div>

        <div className="navigation-buttons">
          {canGoBack ? (
            <button className="nav-button prev-button" onClick={handlePrev}>
              Previous
            </button>
          ) : <div />}
          <div />
        </div>
      </div>
    </div>
  );
}

export default SelfAssessment;

