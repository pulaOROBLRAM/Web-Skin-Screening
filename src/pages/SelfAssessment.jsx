import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ASSESSMENT } from '../data/selfAssessmentQuestions';
import './css/SelfAssessment.css';

function SelfAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;
  const modelPrediction = location.state?.modelPrediction || null;

  // Static 4-step intake. The answer keys (`a`..`d`) map to `src/data/diseases.js` scoring rules.
  const steps = useMemo(
    () => ([
      { key: 'q1', title: 'Question 1', prompt: 'What best describes what you see?' },
      { key: 'q2', title: 'Question 2', prompt: 'What does it feel like?' },
      { key: 'q3', title: 'Question 3', prompt: 'How is it changing over time?' },
      { key: 'q4', title: 'Question 4', prompt: 'Where is it located?' }
    ]),
    []
  );

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const step = steps[stepIdx];
  const optionsObj = ASSESSMENT?.[step.key] || {};
  const options = Object.entries(optionsObj);
  const selected = answers[step.key];

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

  // Answer selection
  const handleSelect = (choiceKey) => {
    setAnswers(prev => ({ ...prev, [step.key]: choiceKey }));
  };

  // Step navigation
  const handleNext = () => {
    if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1);
  };

  const handlePrev = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  };

  // Persist + go to results (results page will compute diagnosis from model+assessment data)
  const handleComplete = () => {
    if (!capturedImage) {
      setError('No image found to analyze. Please upload an image.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    // Save answers for local persistence + review
    localStorage.setItem('assessmentAnswers', JSON.stringify(answers));

    navigate('/results', {
      state: {
        capturedImage,
        answers,
        modelPrediction
      }
    });

    setIsAnalyzing(false);
  };

  const isLast = stepIdx === steps.length - 1;

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <h1 className="assessment-title">Self-Assessment</h1>
        <p className="assessment-note">{step.title}</p>
        {error && <div className="assessment-error">{error}</div>}
        {isAnalyzing && <div className="assessment-loading">Analyzing image via ML model... please wait.</div>}

        <h3 className="question-text">{step.prompt}</h3>

        <div className="options-grid">
          {options.map(([k, label]) => (
            <button
              key={k}
              className={`option-button ${selected === k ? 'selected' : ''}`}
              onClick={() => handleSelect(k)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="navigation-buttons">
          {stepIdx > 0 ? (
            <button className="nav-button prev-button" onClick={handlePrev}>
              Previous
            </button>
          ) : <div />}

          {!isLast ? (
            <button
              className="nav-button next-button"
              onClick={handleNext}
              disabled={!selected}
            >
              Next
            </button>
          ) : (
            <button
              className="nav-button complete-button"
              onClick={handleComplete}
              disabled={!selected}
            >
              Continue to Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelfAssessment;

