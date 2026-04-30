import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADAPTIVE_QUESTIONS } from '../data/adaptiveQuestionnaire';
import './css/SelfAssessment.css';

function SelfAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const modelPrediction = location.state?.modelPrediction || location.state?.predictions || null;
  
  const isValidModelPrediction = (prediction) => {
    if (!prediction) return null;
    if (typeof prediction === 'object' && !Array.isArray(prediction)) {
      return prediction;
    }
    return null;
  };
  
  const SENSITIVITY = {
    speed: {
      enabled: true,
      minMsPerQuestion: 500,
      consecutiveFastLimit: 2,
      weight: 0.35,
    },
    
    pattern: {
      enabled: true,
      windowSize: 4,
      fastThresholdMs: 350,
      allSameMaxScore: 1.0,
      allSameMediumScore: 0.8,
      alternatingMaxScore: 1.0,
      alternatingMediumScore: 0.7,
      weight: 0.25,
    },
    
    tabFocus: {
      enabled: true,
      minHiddenMs: 2000,
      scoreForOneSwitch: 0.9,
      scoreForMultipleSwitches: 1.0,
      weight: 0.5,
    },
    
    global: {
      threshold: 0.25,
      minAnswersForBlock: 2,
      warningMessage: "Please answer thoughtfully. Random selections have been detected."
    }
  };
  
  const [hasValidUpload, setHasValidUpload] = useState(false);
  const [isCheckingUpload, setIsCheckingUpload] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(ADAPTIVE_QUESTIONS.q1);
  const [answers, setAnswers] = useState({});
  const [questionHistory, setQuestionHistory] = useState([ADAPTIVE_QUESTIONS.q1]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [warningModalMessage, setWarningModalMessage] = useState(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  
  const [toastMessage, setToastMessage] = useState(null);
  
  const assessmentStartMsRef = useRef(Date.now());
  const questionStartMsRef = useRef(Date.now());
  const consecutiveFastAnswersRef = useRef(0);
  const answerEventsRef = useRef([]);
  const tabFocusLossesRef = useRef(0);
  const tabHiddenTimeRef = useRef(0);
  const lastAnswerTimeRef = useRef(0);
  const sessionStartRef = useRef(Date.now());
  const answerTimestampsRef = useRef([]);
  
  const RATE_LIMIT_MS = 200;
  const MAX_ANSWERS_PER_MINUTE = 30;
  const validModelPrediction = isValidModelPrediction(modelPrediction);

  const resetAssessment = () => {
    setIsAnalyzing(false);
    setAnswers({});
    setCurrentQuestion(ADAPTIVE_QUESTIONS.q1);
    setQuestionHistory([ADAPTIVE_QUESTIONS.q1]);
    assessmentStartMsRef.current = Date.now();
    questionStartMsRef.current = Date.now();
    consecutiveFastAnswersRef.current = 0;
    answerEventsRef.current = [];
    tabFocusLossesRef.current = 0;
    tabHiddenTimeRef.current = 0;
    lastAnswerTimeRef.current = 0;
    sessionStartRef.current = Date.now();
    answerTimestampsRef.current = [];
    setToastMessage(null);

    try {
      localStorage.removeItem('assessmentAnswers');
      localStorage.removeItem('lastModelPrediction');
    } catch {
    }
  };

  const resetAssessmentWithWarning = (message) => {
    resetAssessment();
    setWarningModalMessage(message);
    setIsWarningModalOpen(true);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    const checkUploadStatus = () => {
      try {
        const storedImage = sessionStorage.getItem('assessmentImage');
        const imageTimestamp = sessionStorage.getItem('imageTimestamp');
        
        if (storedImage && imageTimestamp) {
          const age = Date.now() - parseInt(imageTimestamp);
          if (age < 30 * 60 * 1000) {
            setHasValidUpload(true);
          } else {
            sessionStorage.removeItem('assessmentImage');
            sessionStorage.removeItem('imageTimestamp');
            setHasValidUpload(false);
          }
        } else {
          setHasValidUpload(false);
        }
      } catch (error) {
        console.error('Failed to check sessionStorage:', error);
        setHasValidUpload(false);
      } finally {
        setIsCheckingUpload(false);
      }
    };
    
    checkUploadStatus();
  }, []);

  useEffect(() => {
    const safeLocalStorageGet = (key, validator) => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        const parsed = JSON.parse(item);
        return validator ? validator(parsed) : parsed;
      } catch {
        return null;
      }
    };
    
    const savedAnswers = safeLocalStorageGet('assessmentAnswers', (data) => {
      return data && typeof data === 'object' ? data : null;
    });
    
    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      localStorage.removeItem('assessmentAnswers');
      localStorage.removeItem('lastModelPrediction');
    }
    
    sessionStartRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!SENSITIVITY.tabFocus.enabled) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabHiddenTimeRef.current = Date.now();
      } else if (tabHiddenTimeRef.current > 0) {
        const hiddenDuration = Date.now() - tabHiddenTimeRef.current;
        if (hiddenDuration > SENSITIVITY.tabFocus.minHiddenMs) {
          tabFocusLossesRef.current += 1;
          showToast('Stay on page for accurate results');
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);



  if (isCheckingUpload) {
    return (
      <div className="assessment-container">
        <div className="assessment-card">
          <h1 className="assessment-title">Self-Assessment</h1>
          <div className="assessment-loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!hasValidUpload) {
    return (
      <div className="assessment-container">
        <div className="assessment-card">
          <h1 className="assessment-title">Self-Assessment</h1>
          <p className="assessment-note">Please upload and analyze an image first.</p>
          <button className="nav-button complete-button" onClick={() => navigate('/upload')}>
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  const checkSpeed = ({ elapsedMs, nextConsecutiveFastCount }) => {
    if (!SENSITIVITY.speed.enabled) return 0;
    
    const { minMsPerQuestion, consecutiveFastLimit } = SENSITIVITY.speed;
    
    if (elapsedMs >= minMsPerQuestion) return 0;
    
    if (nextConsecutiveFastCount >= consecutiveFastLimit) {
      showToast('Please take your time');
      return 1;
    }
    if (nextConsecutiveFastCount === consecutiveFastLimit - 1) {
      showToast('Read carefully');
    }
    return 0.5;
  };

  const checkPatterns = ({ recentChoiceKeys, recentElapsedMs }) => {
    if (!SENSITIVITY.pattern.enabled) return 0;
    
    const { windowSize, fastThresholdMs, allSameMaxScore, allSameMediumScore, 
            alternatingMaxScore, alternatingMediumScore } = SENSITIVITY.pattern;
    
    const keys = (recentChoiceKeys || []).slice(-windowSize);
    const times = (recentElapsedMs || []).slice(-windowSize);
    if (keys.length < 3) return 0;

    const fastCount = times.filter((t) => typeof t === 'number' && t < fastThresholdMs).length;
    const fastRatio = fastCount / times.length;

    const allSame = keys.every((k) => k === keys[0]);
    if (allSame) {
      if (fastRatio >= 0.5) {
        showToast('Pattern detected. Answer thoughtfully');
        return allSameMaxScore;
      }
      showToast('Consider your answers carefully');
      return allSameMediumScore;
    }

    const unique = new Set(keys).size;
    const alternating = unique === 2 && keys.every((k, i) => i < 2 || k === keys[i % 2]);
    if (alternating) {
      if (fastRatio >= 0.5) {
        showToast('Pattern detected');
        return alternatingMaxScore;
      }
      return alternatingMediumScore;
    }

    return 0;
  };

  const checkTabFocus = () => {
    if (!SENSITIVITY.tabFocus.enabled) return 0;
    
    const losses = tabFocusLossesRef.current;
    const { scoreForOneSwitch, scoreForMultipleSwitches } = SENSITIVITY.tabFocus;
    
    if (losses >= 2) return scoreForMultipleSwitches;
    if (losses >= 1) return scoreForOneSwitch;
    return 0;
  };

  const ProtectionSystem = {
    checks: [
      { name: 'speed', fn: checkSpeed, weight: SENSITIVITY.speed.weight },
      { name: 'pattern', fn: checkPatterns, weight: SENSITIVITY.pattern.weight },
      { name: 'tabFocus', fn: checkTabFocus, weight: SENSITIVITY.tabFocus.weight }
    ].filter(check => {
      if (check.name === 'speed') return SENSITIVITY.speed.enabled;
      if (check.name === 'pattern') return SENSITIVITY.pattern.enabled;
      if (check.name === 'tabFocus') return SENSITIVITY.tabFocus.enabled;
      return true;
    }),
    
    threshold: SENSITIVITY.global.threshold,
    
    evaluate(context) {
      if (this.checks.length === 0) return { score: 0, isBlocked: false };
      
      const totalWeight = this.checks.reduce((sum, c) => sum + (c.weight || 0), 0) || 1;
      const score = this.checks.reduce((sum, c) => {
        const raw = Number(c.fn(context) || 0);
        const clamped = Math.min(1, Math.max(0, raw));
        return sum + clamped * (c.weight || 0);
      }, 0) / totalWeight;
      
      return { score, isBlocked: score >= this.threshold };
    }
  };

  const handleSelect = (choiceKey) => {
    if (isWarningModalOpen || isAnalyzing) return;
    
    if (!currentQuestion.options || !currentQuestion.options[choiceKey]) {
      console.warn('Invalid choice key attempted:', choiceKey);
      return;
    }
    
    const now = Date.now();
    
    if (now - lastAnswerTimeRef.current < RATE_LIMIT_MS) {
      showToast('Please wait');
      return;
    }
    
    const oneMinuteAgo = now - 60000;
    answerTimestampsRef.current = answerTimestampsRef.current.filter(t => t > oneMinuteAgo);
    if (answerTimestampsRef.current.length >= MAX_ANSWERS_PER_MINUTE) {
      resetAssessmentWithWarning('Too many answers detected. Assessment restarted.');
      return;
    }
    
    if (now - sessionStartRef.current > 15 * 60 * 1000) {
      resetAssessmentWithWarning('Session timeout. Please restart the assessment.');
      return;
    }
    
    let elapsed = now - questionStartMsRef.current;
    elapsed = Math.min(elapsed, 60000);
    
    const nextFastCount = elapsed < SENSITIVITY.speed.minMsPerQuestion 
      ? consecutiveFastAnswersRef.current + 1 
      : 0;

    const recentChoiceKeys = answerEventsRef.current.map((e) => e.choiceKey);
    const recentElapsedMs = answerEventsRef.current.map((e) => e.elapsedMs);
    
    const { isBlocked } = ProtectionSystem.evaluate({
      elapsedMs: elapsed,
      nextConsecutiveFastCount: nextFastCount,
      recentChoiceKeys: [...recentChoiceKeys, choiceKey],
      recentElapsedMs: [...recentElapsedMs, elapsed]
    });

    if (isBlocked) {
      resetAssessmentWithWarning(SENSITIVITY.global.warningMessage);
      return;
    }

    lastAnswerTimeRef.current = now;
    answerTimestampsRef.current.push(now);
    consecutiveFastAnswersRef.current = nextFastCount;
    
    answerEventsRef.current = [
      ...answerEventsRef.current,
      { t: now, questionId: currentQuestion.id, choiceKey, elapsedMs: elapsed }
    ];
    
    const newAnswers = { ...answers, [currentQuestion.id]: choiceKey };
    setAnswers(newAnswers);

    const option = currentQuestion.options[choiceKey];
    if (option) {
      if (option.disease) {
        handleComplete(newAnswers);
        return;
      }

      if (option.nextQuestion) {
        const nextContainer = ADAPTIVE_QUESTIONS[option.nextQuestion];
        if (nextContainer) {
          const questionKeys = Object.keys(nextContainer).filter(key => key.startsWith('q'));
          const nextQuestion = questionKeys.length > 0 ? nextContainer[questionKeys[0]] : nextContainer;
          
          if (nextQuestion && nextQuestion.id) {
            setCurrentQuestion(nextQuestion);
            setQuestionHistory([...questionHistory, nextQuestion]);
            questionStartMsRef.current = Date.now();
          } else {
            handleComplete(newAnswers);
          }
        } else {
          handleComplete(newAnswers);
        }
      } else {
        handleComplete(newAnswers);
      }
    }
  };

  const handlePrev = () => {
    if (questionHistory.length > 1) {
      const newHistory = [...questionHistory];
      newHistory.pop();
      const prevQuestion = newHistory[newHistory.length - 1];
      
      if (prevQuestion) {
        setCurrentQuestion(prevQuestion);
        setQuestionHistory(newHistory);
        questionStartMsRef.current = Date.now();
        consecutiveFastAnswersRef.current = 0;
        answerEventsRef.current = answerEventsRef.current.filter((e) => e.questionId !== currentQuestion.id);
        const newAnswers = { ...answers };
        delete newAnswers[currentQuestion.id];
        setAnswers(newAnswers);
      }
    }
  };

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

    if (answeredCount >= SENSITIVITY.global.minAnswersForBlock && overall.isBlocked) {
      resetAssessmentWithWarning(SENSITIVITY.global.warningMessage);
      return;
    }

    setIsAnalyzing(true);
    setIsWarningModalOpen(false);
    setWarningModalMessage(null);

    try {
      if (finalAnswers && typeof finalAnswers === 'object') {
        localStorage.setItem('assessmentAnswers', JSON.stringify(finalAnswers));
      }
      if (validModelPrediction) {
        localStorage.setItem('lastModelPrediction', JSON.stringify(validModelPrediction));
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }

    navigate('/results', {
      state: {
        answers: finalAnswers,
        modelPrediction: validModelPrediction
      }
    });

    setIsAnalyzing(false);
  };

  const options = Object.entries(currentQuestion.options || {});
  const selected = answers[currentQuestion.id];
  const canGoBack = questionHistory.length > 1;

  return (
    <div className="assessment-container">
      {toastMessage && (
        <div className="assessment-toast">
          {toastMessage}
        </div>
      )}
      
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
              ← Previous
            </button>
          ) : <div />}
          <div />
        </div>

        <div className="assessment-footer-note">
          <p className="reminder-text">
            Take your time for accurate results
          </p>
        </div>
      </div>

      {isWarningModalOpen && (
        <div
          className="assessment-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Assessment warning"
          onClick={() => {
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
                onClick={() => {
                  setIsWarningModalOpen(false);
                  resetAssessment();
                }}
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