import React, { useRef, useState, useEffect } from 'react';
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
  const answerEventsRef = useRef([]);
  const tabFocusLossesRef = useRef(0);
  const tabHiddenTimeRef = useRef(0);

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabHiddenTimeRef.current = Date.now();
      } else if (tabHiddenTimeRef.current > 0) {
        const hiddenDuration = Date.now() - tabHiddenTimeRef.current;
        if (hiddenDuration > 3000) {
          tabFocusLossesRef.current += 1;
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []); // Empty dependency array now

  const resetAssessment = () => {
    setIsAnalyzing(false);
    setAnswers({});
    setCurrentQuestion(ADAPTIVE_QUESTIONS.q1);
    setQuestionHistory([ADAPTIVE_QUESTIONS.q1]);
    assessmentStartMsRef.current = Date.now();
    questionStartMsRef.current = Date.now();
    consecutiveFastAnswersRef.current = 0;
    answerEventsRef.current = [];
    
    // Update these lines:
    tabFocusLossesRef.current = 0;
    tabHiddenTimeRef.current = 0;

    try {
      localStorage.removeItem('assessmentAnswers');
      localStorage.removeItem('lastCapturedImage');
      localStorage.removeItem('lastModelPrediction');
    } catch {
      // ignore storage failures
    }
  };

  const resetAssessmentWithWarning = (message) => {
    resetAssessment();
    setWarningModalMessage(message);
    setIsWarningModalOpen(true);
  };

  const checkSpeed = ({ elapsedMs, nextConsecutiveFastCount }) => {
    // UX-tuned: allow quick users, block obvious random clicking.
    const MIN_MS_PER_QUESTION = 500;
    const CONSECUTIVE_FAST_LIMIT = 3;

    if (elapsedMs >= MIN_MS_PER_QUESTION) return 0;
    return nextConsecutiveFastCount >= CONSECUTIVE_FAST_LIMIT ? 1 : 0.5;
  };

  const checkPatterns = ({ recentChoiceKeys, recentElapsedMs }) => {
    // Pattern heuristics: repeated identical selections or “ping-pong” patterns, especially when fast.
    const windowSize = 6;
    const keys = (recentChoiceKeys || []).slice(-windowSize);
    const times = (recentElapsedMs || []).slice(-windowSize);
    if (keys.length < 4) return 0;

    const fastCount = times.filter((t) => typeof t === 'number' && t < 500).length;
    const fastRatio = fastCount / times.length;

    const allSame = keys.every((k) => k === keys[0]);
    if (allSame) return fastRatio >= 0.5 ? 1 : 0.6;

    const unique = new Set(keys).size;
    const alternating =
      unique === 2 &&
      keys.every((k, i) => i < 2 || k === keys[i % 2]); // ABABAB...
    if (alternating) return fastRatio >= 0.5 ? 0.9 : 0.5;

    return 0;
  };

 const checkTabFocus = () => {
    const losses = tabFocusLossesRef.current;
    //threshold
    if (losses >= 2) return 0.9;
    if (losses >= 1) return 0.7;
    return 0;
  };

  const ProtectionSystem = {
    checks: [
      { name: 'speed', fn: checkSpeed, weight: 0.3 },
      { name: 'pattern', fn: checkPatterns, weight: 0.2 },
      { name: 'tabFocus', fn: checkTabFocus, weight: 0.5 }
    ],
    threshold: 0.28,
    evaluate(context) {
      const totalWeight = this.checks.reduce((sum, c) => sum + (c.weight || 0), 0) || 1;
      const score = this.checks.reduce((sum, c) => {
        const raw = Number(c.fn(context) || 0);
        const clamped = Math.min(1, Math.max(0, raw));
        return sum + clamped * (c.weight || 0);
      }, 0) / totalWeight;
      return { score, isBlocked: score >= this.threshold };
    }
  };

  // Handle answer selection
  const handleSelect = (choiceKey) => {
    if (isWarningModalOpen || isAnalyzing) return;

    const now = Date.now();
    const elapsed = now - questionStartMsRef.current;
    const nextFastCount = elapsed < 500 ? consecutiveFastAnswersRef.current + 1 : 0;

    const recentChoiceKeys = answerEventsRef.current.map((e) => e.choiceKey);
    const recentElapsedMs = answerEventsRef.current.map((e) => e.elapsedMs);
    const { isBlocked } = ProtectionSystem.evaluate({
      elapsedMs: elapsed,
      nextConsecutiveFastCount: nextFastCount,
      recentChoiceKeys: [...recentChoiceKeys, choiceKey],
      recentElapsedMs: [...recentElapsedMs, elapsed]
    });

    if (isBlocked) {
      resetAssessmentWithWarning(
        "We detected random/too-fast responses. For accuracy, the self‑assessment has been restarted. Please answer carefully."
      );
      return;
    }

    consecutiveFastAnswersRef.current = nextFastCount;
    answerEventsRef.current = [
      ...answerEventsRef.current,
      { t: now, questionId: currentQuestion.id, choiceKey, elapsedMs: elapsed }
    ];
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
        answerEventsRef.current = answerEventsRef.current.filter((e) => e.questionId !== currentQuestion.id);

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
    const averageMsPerAnswer = answeredCount > 0 ? totalElapsed / answeredCount : totalElapsed;
    const overall = ProtectionSystem.evaluate({
      elapsedMs: averageMsPerAnswer,
      nextConsecutiveFastCount: consecutiveFastAnswersRef.current,
      recentChoiceKeys: answerEventsRef.current.map((e) => e.choiceKey),
      recentElapsedMs: answerEventsRef.current.map((e) => e.elapsedMs)
    });

    if (answeredCount >= 3 && overall.isBlocked) {
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

