import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADAPTIVE_QUESTIONS } from '../data/adaptiveQuestionnaire';
import './css/SelfAssessment.css';

function SelfAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;
  const modelPrediction = location.state?.modelPrediction || location.state?.predictions || null;

  // Adaptive questionnaire state
  const [currentQuestion, setCurrentQuestion] = useState(ADAPTIVE_QUESTIONS.q1);
  const [answers, setAnswers] = useState({});
  const [questionHistory, setQuestionHistory] = useState([ADAPTIVE_QUESTIONS.q1]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [warningModalMessage, setWarningModalMessage] = useState(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const assessmentStartMsRef = useRef(Date.now());
  const questionStartMsRef = useRef(Date.now());
  const consecutiveFastAnswersRef = useRef(0);

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

  const resetAssessment = () => {
    setIsAnalyzing(false);
    setAnswers({});
    setCurrentQuestion(ADAPTIVE_QUESTIONS.q1);
    setQuestionHistory([ADAPTIVE_QUESTIONS.q1]);
    assessmentStartMsRef.current = Date.now();
    questionStartMsRef.current = Date.now();
    consecutiveFastAnswersRef.current = 0;

    try {
      localStorage.removeItem('assessmentAnswers');
      localStorage.removeItem('lastCapturedImage');
      localStorage.removeItem('lastModelPrediction');
    } catch {
      // ignore storage failures (e.g., privacy mode)
    }
  };

  const resetAssessmentWithWarning = (message) => {
    resetAssessment();
    setWarningModalMessage(message);
    setIsWarningModalOpen(true);
  };

  // Guardrail: if someone is clicking through too quickly, treat as random input
  const isSuspiciouslyFast = (elapsedMs, nextFastCount) => {
    // Heuristics tuned for UX: allow quick users, block obvious random clicking.
    const MIN_MS_PER_QUESTION = 500;
    const CONSECUTIVE_FAST_LIMIT = 3;

    if (elapsedMs >= MIN_MS_PER_QUESTION) return false;
    return nextFastCount >= CONSECUTIVE_FAST_LIMIT;
  };

  // Handle answer selection
  const handleSelect = (choiceKey) => {
    if (isWarningModalOpen || isAnalyzing) return;

    const now = Date.now();
    const elapsed = now - questionStartMsRef.current;
    const nextFastCount = elapsed < 500 ? consecutiveFastAnswersRef.current + 1 : 0;

    if (isSuspiciouslyFast(elapsed, nextFastCount)) {
      resetAssessmentWithWarning(
        "We detected random/too-fast responses. For accuracy, the self‑assessment has been restarted. Please answer carefully."
      );
      return;
    }

    consecutiveFastAnswersRef.current = nextFastCount;
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
            setQuestionHistory([...questionHistory, nextQuestion]);
            questionStartMsRef.current = Date.now();
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
      const prevQuestion = newHistory[newHistory.length - 1];
      
      if (prevQuestion) {
        setCurrentQuestion(prevQuestion);
        setQuestionHistory(newHistory);
        questionStartMsRef.current = Date.now();
        consecutiveFastAnswersRef.current = 0;

        // Remove the answer for the current question we're going back from
        const newAnswers = { ...answers };
        delete newAnswers[currentQuestion.id];
        setAnswers(newAnswers);
      }
    }
  };

  // Complete assessment and navigate to results
  const handleComplete = (finalAnswers) => {
    const totalElapsed = Date.now() - assessmentStartMsRef.current;
    const answeredCount = Object.keys(finalAnswers || {}).length;
    const suspiciouslyFastOverall =
      answeredCount >= 3 && totalElapsed < answeredCount * 500;

    if (suspiciouslyFastOverall) {
      resetAssessmentWithWarning(
        "Your responses were completed unusually fast, which looks random. The self‑assessment has been restarted to protect accuracy."
      );
      return;
    }

    setIsAnalyzing(true);
    setIsWarningModalOpen(false);
    setWarningModalMessage(null);

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

      {isWarningModalOpen && (
        <div
          className="assessment-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Assessment warning"
          onClick={() => {
            // Clicking outside closes the modal, but assessment is already reset.
            setIsWarningModalOpen(false);
          }}
        >
          <div
            className="assessment-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="assessment-modal-header">
              <h3 className="assessment-modal-title">Warning</h3>
              <button
                type="button"
                className="assessment-modal-close"
                onClick={() => setIsWarningModalOpen(false)}
                aria-label="Close warning"
              >
                ×
              </button>
            </div>
            <p className="assessment-modal-message">{warningModalMessage}</p>
            <div className="assessment-modal-actions">
              <button
                type="button"
                className="nav-button complete-button"
                onClick={() => setIsWarningModalOpen(false)}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelfAssessment;

