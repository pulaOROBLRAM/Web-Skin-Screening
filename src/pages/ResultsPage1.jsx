import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import {
  FaDownload,
  FaHome,
  FaExclamationTriangle,
  FaStethoscope
} from 'react-icons/fa';
import './css/ResultsPage.css';
import { CONFIG } from '../config';

// Utility imports
import { combinePredictions, findConditionDescription, formatModelPrediction } from '../utils/predictionProcessing';
import { ADAPTIVE_QUESTIONS } from '../data/adaptiveQuestionnaire';

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage;
  const assessmentAnswersRaw = location.state?.answers || {};
  const rawModelPrediction = location.state?.modelPrediction;

  // Format the raw backend response so the scoring engine can read topPrediction
  const modelPrediction = formatModelPrediction(rawModelPrediction);

  // Report download configuration (kept intact)
  const [reportSettings, setReportSettings] = useState(CONFIG.REPORT_SETTINGS);
  const [showReportConfig, setShowReportConfig] = useState(false);
  const [showDebug, setShowDebug] = useState(false); // Toggle for viewing raw calculation math

  const handleToggleSetting = (setting) => {
    setReportSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const hasAnswers = Boolean(assessmentAnswersRaw && Object.keys(assessmentAnswersRaw).length > 0);
  const mlAndClinicalResults = combinePredictions({
    modelPrediction,
    assessmentAnswers: assessmentAnswersRaw || {},
    topN: 4
  });
  const combinedView = mlAndClinicalResults.combined || [];
  if (!capturedImage) {
    return (
      <div className="results-container">
        <div className="results-content">
          <div className="error-state">
            <FaExclamationTriangle className="error-icon" />
            <h2>Error</h2>
            <p>No image available.</p>
            <button className="action-btn secondary-btn" onClick={() => navigate('/')}>
              <FaHome /> Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Diagnosis results are driven primarily by combined ML+similarity scores
  const toAssessmentAnswerList = (rawAnswers) => {
    if (!rawAnswers || Object.keys(rawAnswers).length === 0) return [];

    const traversedList = [];
    let nextContainerId = 'q1';

    while (nextContainerId) {
      const container = ADAPTIVE_QUESTIONS[nextContainerId];
      if (!container) break;

      const questionKeys = Object.keys(container).filter(k => k.startsWith('q'));
      const question = questionKeys.length > 0 ? container[questionKeys[0]] : container;

      if (!question || !question.id) break;

      const choiceKey = rawAnswers[question.id];
      if (!choiceKey || typeof choiceKey !== 'string') break;

      const option = question.options ? question.options[choiceKey] : null;
      
      traversedList.push({
        questionId: question.id,
        question: question.text || question.id,
        answer: option?.text || choiceKey
      });

      if (option?.disease) {
        break; // Match reached
      } else if (option?.nextQuestion) {
        nextContainerId = option.nextQuestion;
      } else {
        break; // End
      }
    }

    return traversedList;
  };

  const assessmentAnswers = toAssessmentAnswerList(assessmentAnswersRaw);

  const combinedPrimary = combinedView.length > 0 ? combinedView[0] : null;
  const primaryMatch = combinedPrimary ? {
    id: combinedPrimary.id,
    matchPercentage: combinedPrimary.finalScore * 100,
    source: combinedPrimary.source,
    modelConfidence: combinedPrimary.modelMatch,
    similarityToModel: combinedPrimary.similarityToModel
  } : (mlAndClinicalResults?.surveyResults?.length > 0 ? mlAndClinicalResults.surveyResults[0] : null);

  const primaryMatchDetails = primaryMatch ? findConditionDescription(primaryMatch.id) : null;

  const displayCondition = (primaryMatchDetails && Object.keys(primaryMatchDetails).length > 0)
    ? primaryMatchDetails
    : null;

  const handleDownloadReport = () => {
    const settings = reportSettings;

    // Modular Section Helpers
    const imageSection = settings.includeImage ? `
      <div class="section">
        <div class="section-title">Analysis Image</div>
        <div class="image-container">
          <img src="${capturedImage}" alt="Skin Analysis Image"/>
        </div>
      </div>` : '';

    const resultsSection = `
      <div class="section">
        <div class="section-title">Screening Results: Top Detected Conditions</div>
        <table style="border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 15px; border: none;">Potential Condition</th>
              <th style="padding: 15px; border: none; text-align: center;">Confidence Level</th>
            </tr>
          </thead>
          <tbody>
            ${combinedView.slice(0, 4).map((res, idx) => `
              <tr style="background-color: ${idx === 0 ? '#f0f7ff' : '#ffffff'};">
                <td style="padding: 12px 15px; border-top: 1px solid #e2e8f0; font-weight: ${idx === 0 ? '700' : '400'};">
                  ${res.label}
                  ${idx === 0 ? `<span style="margin-left: 10px; font-size: 0.75rem; background-color: #dbeafe; color: ${settings.primaryColor}; padding: 2px 8px; border-radius: 4px;">PRIMARY MATCH</span>` : ''}
                </td>
                <td style="padding: 12px 15px; border-top: 1px solid #e2e8f0; text-align: center; font-weight: 700; color: ${settings.primaryColor};">${(res.finalScore * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;

    const recommendationsSection = settings.includeRecommendations ? `
      <div class="section">
        <div class="section-title">About the Primary Condition</div>
        <div style="font-size: 1rem; color: #4b5563; margin-bottom: 15px;">
          ${displayCondition?.description || "Consult a medical professional for a detailed diagnosis and personalized treatment plan."}
        </div>
        <div style="background-color: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Reference:</div>
          <a href="https://www.mayoclinic.org/search/search-results?q=${encodeURIComponent(displayCondition?.name || 'skin condition')}" style="color: #1e3a8a; text-decoration: none; font-weight: 600; font-size: 0.9rem;">
            Mayo Clinic - Medical Information Center
          </a>
        </div>
      </div>` : '';

    const analysisNotesSection = settings.includeAnalysisNotes ? `
      <div class="section">
        <div class="section-title">Dermatological Analysis Notes</div>
        <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid ${settings.primaryColor}; border-radius: 4px; font-size: 0.95rem; color: #4b5563; line-height: 1.6;">
          ${(displayCondition?.causes && displayCondition.causes.trim())
        ? displayCondition.causes
        : "A visual examination by a qualified medical professional is recommended. This condition requires clinical assessment to determine the appropriate treatment path. Please avoid applying non-prescribed topical treatments until a consultation is complete."}
        </div>
      </div>` : '';

    const clinicalNoteSection = `
      <div class="section" style="margin-top: 20px; margin-bottom: 30px;">
        <div style="background-color: #fffaf0; border: 2px solid #ed8936; padding: 20px; border-radius: 12px; text-align: center;">
          <div style="color: #c05621; font-weight: 800; font-size: 1.1rem; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px;">
            ⚠️ Clinical Notice
          </div>
          <div style="font-size: 1.25rem; font-weight: 700; color: #2d3748; line-height: 1.4;">
            Please contact a dermatologist for a professional diagnosis
          </div>
        </div>
      </div>`;

    const reportContent = `
      <html>
        <head>
          <title>${settings.companyName} Analysis Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              padding: 40px; 
              color: #2d3748;
              line-height: 1.6;
              background-color: #fff;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid ${settings.primaryColor};
              margin-bottom: 30px;
              padding-bottom: 20px;
            }
            .header h1 { 
              color: ${settings.primaryColor}; 
              margin: 0; 
              font-weight: 800;
              font-size: 2.2rem;
            }
            .meta-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              font-size: 0.9rem;
              color: #718096;
              font-weight: 500;
            }
            .section { margin-bottom: 40px; }
            .section-title {
              font-size: 1.3rem;
              font-weight: 700;
              color: ${settings.primaryColor};
              border-bottom: 1px solid #e2e8f0;
              margin-bottom: 18px;
              padding-bottom: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              background-color: #fff;
            }
            th, td {
              text-align: left;
              padding: 14px;
              border: 1px solid #e2e8f0;
              font-size: 0.95rem;
            }
            th {
              background-color: #f7fafc;
              color: #4a5568;
              font-weight: 700;
              text-transform: uppercase;
              font-size: 0.85rem;
              letter-spacing: 0.5px;
            }
            .image-container {
              text-align: center;
              margin-bottom: 30px;
            }
            .image-container img {
              max-width: 480px;
              border-radius: 12px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
            .footer {
              margin-top: 60px;
              font-size: 0.85rem;
              color: #a0aec0;
              text-align: center;
              border-top: 1px solid #edf2f7;
              padding-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: ${settings.primaryColor};">${settings.companyName}</h1>
            <p style="margin-top: 5px; color: #718096; font-weight: 600;">DERMATOLOGICAL ASSESSMENT REPORT</p>
          </div>

          <div class="meta-info">
            <span>Report ID: <strong>SS-${Math.floor(Math.random() * 1000000)}</strong></span>
            <span>Generated: <strong>${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</strong></span>
          </div>

          ${imageSection}
          ${resultsSection}
          ${clinicalNoteSection}
          ${recommendationsSection}
          ${analysisNotesSection}

          <div class="footer">
            <p style="margin-bottom: 5px;">This report is generated by AI for informational purposes only and does not substitute professional medical advice.</p>
            <p>© 2025 ${settings.companyName} • Confidential Medical Assessment</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skin-analysis-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };



  return (
    <div className="results-container">
      {/* Header Navigation */}
      <nav className="results-nav">
        <div className="nav-content">
          <div className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <FaStethoscope style={{ marginRight: '10px', color: '#10b981' }} />
            SkinSight AI
          </div>
          <div className="nav-links">
            <a href="#home" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
            <a href="#about">About</a>
            <a href="#how-to-use">How To Use</a>
            <button className="nav-contact-btn" onClick={() => navigate('/')}>Contact Us</button>
          </div>
        </div>
      </nav>

      <div className="results-content">
        <div className="results-header">
          <h1>Analysis Results</h1>
        </div>

        {/* Analysis Section (Conditions | Image + Recommendations) */}
        <div className="results-analysis-container">

          {/* Left Column: Conditions List */}
          <div className="conditions-list-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="analysis-header">Detected Conditions</h2>
              <button
                onClick={() => setShowDebug(!showDebug)}
                style={{ fontSize: '11px', padding: '4px 8px', background: showDebug ? '#ef4444' : '#e5e7eb', color: showDebug ? 'white' : '#4b5563', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {showDebug ? 'Hide Debug Math' : 'Show Debug Math'}
              </button>
            </div>
            <div className="conditions-list">
              {combinedView.length > 0 ? (
                combinedView.map((result, index) => {
                  const conditionInfo = findConditionDescription(result.id);
                  const diseaseName = conditionInfo?.name || result.label || 'Unknown';
                  const displayScore = Math.round((result.finalScore || 0) * 100);

                  return (
                    <div key={index} className={`condition-list-item ${index === 0 ? 'highlighted-top-condition' : ''}`} style={{ flexWrap: 'wrap' }}>
                      <div className="condition-name-container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {index === 0 && <span className="top-match-badge">Primary Match</span>}
                          <div className="condition-name-text">{diseaseName}</div>
                        </div>
                        <div className="progress-circle" style={{ '--progress': displayScore }}>
                          <span className="progress-value">{displayScore}%</span>
                        </div>
                      </div>

                      {/* Interactive Math Debugger */}
                      {showDebug && result.debugMath && (
                        <div style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#f8fafc', borderLeft: '3px solid #3b82f6', fontSize: '12px', fontFamily: 'monospace', color: '#334155' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#1e40af' }}>RAW SCORE ACCUMULATION: {result.debugMath.rawTotal} points</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>
                            <span>Assessment (Max 0.20):</span>
                            <span>{result.debugMath.surveyRaw} pts</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '3px' }}>
                            <span>AI Symptom and Visual Similarity (Max 0.80):</span>
                            <span>{result.debugMath.similarityRaw} pts</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="no-conditions">Complete the self-assessment to see results.</div>
              )}
            </div>

            {/* Clinical Disclaimer moved here */}
            <div className="recommendation-note">
              <p><strong>Clinical Note:</strong> Please contact a dermatologist for a professional diagnosis</p>
            </div>

            {/* Book Appointment - sticky with conditions */}
            <button
              className="book-appointment-btn"
              onClick={() => window.location.href = CONFIG.BOOKING_URL}
            >
              Book an Appointment
            </button>
          </div>

          {/* Right Column: Image + Recommendations Stack */}
          <div className="image-recs-stack">
            {/* Top: Image */}
            <div className="analysis-image-container">
              {capturedImage ? (
                <div className="image-wrapper">
                  <img
                    src={capturedImage}
                    alt="Analyzed skin condition"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('image-error');
                    }}
                  />
                </div>
              ) : (
                <div className="image-placeholder">
                  <FontAwesomeIcon icon={faImage} className="placeholder-icon" />
                  <p>No image available</p>
                </div>
              )}
            </div>

            {/* Bottom: About the Primary Condition */}
            <div className="recommendations-container">
              <h2 className="analysis-header">About the Primary Condition</h2>
              <div className="condition-knowledge-base">
                <p className="condition-description-text">
                  {displayCondition?.description || "Consult a medical professional for a detailed diagnosis and personalized treatment plan."}
                </p>

                <div className="condition-reference-box">
                  <span className="reference-label">Reference:</span>
                  <a
                    href={`https://www.mayoclinic.org/search/search-results?q=${encodeURIComponent(displayCondition?.name || 'skin condition')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reference-link"
                  >
                    Mayo Clinic - Medical Information Center
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Self-Assessment Answers - Two Column Below */}
        <div className="assessment-answers-section">
          <h2 className="section-title">Self-Assessment Answers</h2>
          <div className="answers-list">
            {assessmentAnswers.length > 0 ? (
              assessmentAnswers.map((item, index) => (
                <div key={index} className="answer-card">
                  <span className="answer-icon">👤</span>
                  <div className="answer-content">
                    <p className="answer-question">{item.question}</p>
                    <p className="answer-text">{item.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No assessment answers available</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button className="action-btn primary-btn" onClick={() => setShowReportConfig(!showReportConfig)}>
            <FaDownload /> {showReportConfig ? 'Hide Options' : 'Download My Results'}
          </button>
          <button className="action-btn secondary-btn" onClick={() => navigate('/')}>
            <FaHome /> Return Home
          </button>
        </div>

        {/* Report Download Configuration UI - shown only when toggled */}
        {showReportConfig && (
          <div className="report-config-panel">
            <div className="report-config-title">
              <FaDownload /> Report Download Options
            </div>
            <div className="config-toggles">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={reportSettings.includeImage}
                  onChange={() => handleToggleSetting('includeImage')}
                />
                <span className="toggle-label">Include Image</span>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={reportSettings.includeRecommendations}
                  onChange={() => handleToggleSetting('includeRecommendations')}
                />
                <span className="toggle-label">Include Recommendations</span>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={reportSettings.includeAnalysisNotes}
                  onChange={() => handleToggleSetting('includeAnalysisNotes')}
                />
                <span className="toggle-label">Include Analysis Notes</span>
              </label>
            </div>
            <button className="action-btn primary-btn download-report-btn" onClick={handleDownloadReport}>
              <FaDownload /> Download Report as PDF
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="results-footer">
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

export default ResultsPage;