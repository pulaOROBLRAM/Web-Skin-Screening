import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import {
  FaChartBar,
  FaListUl,
  FaDownload,
  FaHome,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBandAid,
  FaStethoscope
} from 'react-icons/fa';
import './css/ResultsPage.css';
import { CONFIG } from '../config';

// Utility imports
import {
  getTopPredictionWithDetails,
  findConditionDescription,
  formatDiseaseName
} from '../utils/predictionProcessing';

import {
  calculateWeightedResults
} from './SelfAssessment';

import {
  CATEGORY_QUESTIONS,
  getTargetCategory,
  getTopPrediction
} from './selfAssessmentQuestions';

import { formatAssessmentAnswers } from '../utils/assessmentFormatter';

const DISPLAY_THRESHOLDS = {
  'INFLAMMATORY': 0,
  'INFECTIOUS': 0,
  'AUTOIMMUNE': 0,
  'BENIGN_GROWTH': 0,
  'PIGMENTARY': 0,
  'SKIN_CANCER': 0,
  'ENVIRONMENTAL': 0,
  'DEFAULT': 0
};

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const predictions = location.state?.predictions;
  const capturedImage = location.state?.capturedImage;
  const assessmentData = location.state?.answers;
  const assessmentQuestions = location.state?.assessmentQuestions; // This is key!
  const diseaseScores = location.state?.diseaseScores;
  const isAdaptive = location.state?.adaptive || false;

  const [reportSettings, setReportSettings] = useState(CONFIG.REPORT_SETTINGS);
  const [showReportConfig, setShowReportConfig] = useState(false);

  const handleToggleSetting = (setting) => {
    setReportSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const assessmentAnswers = formatAssessmentAnswers(assessmentData, assessmentQuestions);

  console.log('ResultsPage received:', {
    predictions,
    diseaseScores,
    assessmentData,
    isAdaptive
  });

  if (!predictions || !capturedImage) {
    return (
      <div className="results-container">
        <div className="results-content">
          <div className="error-state">
            <FaExclamationTriangle className="error-icon" />
            <h2>Error</h2>
            <p>No analysis results available.</p>
            <button className="action-btn secondary-btn" onClick={() => navigate('/')}>
              <FaHome /> Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const topPrediction = getTopPredictionWithDetails(predictions);

  const urgencyLevel =
    topPrediction?.probability > 0.7 && (topPrediction?.condition === 'MEL' || topPrediction?.condition === 'SCC')
      ? 'high'
      : topPrediction?.probability > 0.5
        ? 'moderate'
        : 'low';

  const getAllCategoriesResults = () => {
    const results = [];
    
    // --- Case A: Adaptive flow (Merged Clinical + AI) ---
    if (isAdaptive && diseaseScores && Object.keys(diseaseScores).length > 0) {
      const topPredString = getTopPrediction(predictions);
      const targetCategory = getTargetCategory(topPredString);
      
      // 1. Start with Clinical scores (already filtered by category)
      const clinicalEntries = Object.entries(diseaseScores).map(([disease, score]) => ({
        disease,
        score: score * 1.5, // Give clinical data a slight boost weight
        category: targetCategory,
        origin: 'clinical'
      }));

      // 2. Map AI raw predictions
      const aiEntries = Object.entries(predictions.predictions || {}).map(([disease, prob]) => ({
        disease: disease.replace(/_/g, ' '),
        score: prob * 10, // Scale AI 0.0-1.0 to 0-10 range to match clinical base
        category: getTargetCategory(disease),
        origin: 'ai'
      }));

      // 3. Merge them (Sum scores if disease appears in both)
      const mergedMap = {};
      
      [...clinicalEntries, ...aiEntries].forEach(item => {
        const key = item.disease.toLowerCase().replace(/\s+/g, '_');
        if (!mergedMap[key]) {
          mergedMap[key] = { ...item, score: item.score };
        } else {
          mergedMap[key].score += item.score;
          // Upgrade category if clinical has a better guess
          if (item.origin === 'clinical') mergedMap[key].category = item.category;
        }
      });

      results.push(...Object.values(mergedMap));
    } 
    // --- Case B: Legacy flow (Pre-adaptive) ---
    else if (assessmentData) {
      const categories = ['INFLAMMATORY', 'INFECTIOUS', 'AUTOIMMUNE', 'BENIGN_GROWTH', 'PIGMENTARY', 'SKIN_CANCER', 'ENVIRONMENTAL'];
      
      categories.forEach(category => {
        const weightedCategories = calculateWeightedResults(assessmentData, topPrediction?.condition);
        const categoryData = weightedCategories?.[category];
        
        if (categoryData && Object.keys(categoryData).length > 0) {
          const categoryDiseases = Object.entries(categoryData)
            .map(([disease, score]) => ({
              disease,
              score,
              category: category
            }));
          
          results.push(...categoryDiseases);
        }
      });
    }

    // First, sort all results by score
    const sortedResults = results.sort((a, b) => b.score - a.score);
    
    // Take top 4 results
    const TOP_RESULTS_COUNT = 4;
    const topResults = sortedResults.slice(0, TOP_RESULTS_COUNT);
    
    // Calculate total score based ONLY on top results
    const topResultsTotal = topResults.reduce((sum, item) => sum + item.score, 0);
    
    // Calculate percentages based on top results total
    const finalResults = topResults.map(item => {
      const percentage = topResultsTotal > 0 ? (item.score / topResultsTotal) * 100 : 0;
      
      return {
        disease: item.disease,
        percentage: Number(percentage.toFixed(0)), // Round to whole number
        score: item.score,
        category: item.category
      };
    });

    console.log('Top results with recalculated percentages:', finalResults);
    console.log('Sum of percentages:', finalResults.reduce((sum, r) => sum + r.percentage, 0));

    return finalResults;
  };

  const allDiseaseResults = getAllCategoriesResults();
  
  // Get the enriched details for the primary match (weighted result)
  const primaryMatch = allDiseaseResults.length > 0 ? allDiseaseResults[0] : null;
  const primaryMatchDetails = primaryMatch ? findConditionDescription(primaryMatch.disease) : null;
  
  // Fallback to topPrediction if primaryMatch details are missing
  const displayCondition = (primaryMatchDetails && Object.keys(primaryMatchDetails).length > 0) 
    ? primaryMatchDetails 
    : topPrediction;

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
            ${allDiseaseResults.slice(0, 4).map((res, idx) => `
              <tr style="background-color: ${idx === 0 ? '#f0f7ff' : '#ffffff'};">
                <td style="padding: 12px 15px; border-top: 1px solid #e2e8f0; font-weight: ${idx === 0 ? '700' : '400'};">
                  ${res.disease.replace(/_/g, ' ')}
                  ${idx === 0 ? `<span style="margin-left: 10px; font-size: 0.75rem; background-color: #dbeafe; color: ${settings.primaryColor}; padding: 2px 8px; border-radius: 4px;">PRIMARY MATCH</span>` : ''}
                </td>
                <td style="padding: 12px 15px; border-top: 1px solid #e2e8f0; text-align: center; font-weight: 700; color: ${settings.primaryColor};">${res.percentage}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;

    const assessmentSection = settings.includeAssessmentAnswers ? `
      <div class="section">
        <div class="section-title">Clinical Intake & Symptoms</div>
        <table style="border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 15px; border: none; width: 60%;">Assessment Question</th>
              <th style="padding: 15px; border: none;">Patient Response</th>
            </tr>
          </thead>
          <tbody>
            ${assessmentAnswers.map((item, idx) => `
              <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 12px 15px; border-top: 1px solid #e2e8f0;">${item.question}</td>
                <td style="padding: 12px 15px; border-top: 1px solid #e2e8f0; font-weight: 600; color: ${settings.primaryColor};">${item.answer}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>` : '';

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
      <div class="section">
        <div style="background-color: #f0f7ff; padding: 15px; border-left: 4px solid #1e3a8a; border-radius: 8px; font-size: 1rem; color: #1e3a8a; line-height: 1.6;">
          <strong>Clinical Note:</strong> For a more personalized recommendation, contact a professional
        </div>
      </div>`;

    const reportContent = `
      <html>
        <head>
          <title>${settings.companyName} Analysis Report</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px; 
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid ${settings.primaryColor};
              margin-bottom: 30px;
              padding-bottom: 20px;
            }
            .header h1 { color: ${settings.primaryColor}; margin: 0; }
            .meta-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              font-size: 0.9rem;
              color: #666;
            }
            .section { margin-bottom: 40px; }
            .section-title {
              font-size: 1.2rem;
              font-weight: bold;
              color: ${settings.primaryColor};
              border-bottom: 1px solid #e5e7eb;
              margin-bottom: 15px;
              padding-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              text-align: left;
              padding: 12px;
              border: 1px solid #e5e7eb;
            }
            th {
              background-color: #f8fafc;
              color: ${settings.primaryColor};
              font-weight: 600;
            }
            .image-container {
              text-align: center;
              margin-bottom: 30px;
            }
            .image-container img {
              max-width: 400px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .recommendation-item {
              margin-bottom: 8px;
              padding-left: 20px;
              position: relative;
            }
            .recommendation-item::before {
              content: "•";
              position: absolute;
              left: 0;
              color: ${settings.primaryColor};
              font-weight: bold;
            }
            .footer {
              margin-top: 50px;
              font-size: 0.8rem;
              color: #999;
              text-align: center;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${settings.companyName} Analysis Report</h1>
          </div>

          <div class="meta-info">
            <span>Report ID: SS-${Math.floor(Math.random() * 1000000)}</span>
            <span>Generated: ${new Date().toLocaleString()}</span>
          </div>

          ${imageSection}
          ${resultsSection}
          ${clinicalNoteSection}
          ${assessmentSection}
          ${recommendationsSection}
          ${analysisNotesSection}

          <div class="footer">
            <p>This report is generated by AI for informational purposes only and does not substitute professional medical advice.</p>
            <p>© 2025 ${settings.companyName}. All rights reserved.</p>
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
            <h2 className="analysis-header">Detected Conditions</h2>
            <div className="conditions-list">
              {allDiseaseResults.length > 0 ? (
                allDiseaseResults.map((result, index) => {
                  const conditionInfo = findConditionDescription(result.disease);
                  const diseaseName = conditionInfo?.name || 
                                    result.disease.split('_').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                    ).join(' ') ||
                                    result.disease.replace(/_/g, ' ');
                  
                  return (
                    <div key={index} className={`condition-list-item ${index === 0 ? 'highlighted-top-condition' : ''}`}>
                      <div className="condition-name-container">
                        {index === 0 && <span className="top-match-badge">Primary Match</span>}
                        <div className="condition-name-text">{diseaseName}</div>
                      </div>
                      <div className="progress-circle" style={{'--progress': result.percentage}}>
                        <span className="progress-value">{result.percentage}%</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-conditions">No Conditions Detected</div>
              )}
            </div>



            {/* Clinical Disclaimer moved here */}
            <div className="recommendation-note">
              <p><strong>Clinical Note:</strong> For a more personalized recommendation, contact a professional</p>
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
                  checked={reportSettings.includeAssessmentAnswers} 
                  onChange={() => handleToggleSetting('includeAssessmentAnswers')}
                />
                <span className="toggle-label">Include Assessment Answers</span>
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