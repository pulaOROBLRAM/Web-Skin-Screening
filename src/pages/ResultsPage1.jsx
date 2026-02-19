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
  FaBandAid
} from 'react-icons/fa';
import './css/ResultsPage.css';

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

  const handleDownloadReport = () => {
    const reportContent = `
      <html>
        <head>
          <title>SkinSight AI Analysis Report</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px; 
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #1e3a8a;
              margin-bottom: 30px;
              padding-bottom: 20px;
            }
            .header h1 { color: #1e3a8a; margin: 0; }
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
              color: #1e3a8a;
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
              color: #1e3a8a;
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
              color: #1e3a8a;
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
            <h1>SkinSight AI Analysis Report</h1>
          </div>

          <div class="meta-info">
            <span>Report ID: SS-${Math.floor(Math.random() * 1000000)}</span>
            <span>Generated: ${new Date().toLocaleString()}</span>
          </div>

          <div class="section">
            <div class="section-title">Analysis Image</div>
            <div class="image-container">
              <img src="${capturedImage}" alt="Skin Analysis Image"/>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Top Detected Conditions</div>
            <table>
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Confidence Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${allDiseaseResults.slice(0, 4).map(res => `
                  <tr>
                    <td>${res.disease.replace(/_/g, ' ')}</td>
                    <td>${res.percentage}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Self-Assessment Data</div>
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>User Answer</th>
                </tr>
              </thead>
              <tbody>
                ${assessmentAnswers.map(item => `
                  <tr>
                    <td>${item.question}</td>
                    <td>${item.answer}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Clinical Recommendations</div>
            <div class="recommendations">
              ${topPrediction?.recommendations?.map(rec => `
                <div class="recommendation-item">${typeof rec === "string" ? rec : rec.text}</div>
              `).join('') || 'No recommendations available'}
            </div>
          </div>

          <div class="footer">
            <p>This report is generated by AI for informational purposes only and does not substitute professional medical advice.</p>
            <p>© 2025 SkinSight AI. All rights reserved.</p>
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

  const getAllCategoriesResults = () => {
    const results = [];
    
    if (isAdaptive && diseaseScores && Object.keys(diseaseScores).length > 0) {
      const topPredString = getTopPrediction(predictions);
      const targetCategory = getTargetCategory(topPredString);
      const categoryData = diseaseScores;

      if (categoryData && Object.keys(categoryData).length > 0) {
        const allDiseases = Object.entries(categoryData)
          .map(([disease, score]) => ({
            disease,
            score,
            category: targetCategory
          }));
        
        results.push(...allDiseases);
      }
    } else if (assessmentData) {
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

  return (
    <div className="results-container">
      {/* Header Navigation */}
      <nav className="results-nav">
        <div className="nav-content">
          <div className="nav-logo">SkinSight AI</div>
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

        {/* Detected Conditions */}
        <div className="detected-conditions-section">
          <h2 className="section-title">Detected Conditions</h2>
          <div className="conditions-grid">
            {allDiseaseResults.length > 0 ? (
              allDiseaseResults.map((result, index) => {
                // Get condition information
                const conditionInfo = findConditionDescription(result.disease);
                
                // Get disease name - use info.name if available, otherwise format the disease key
                const diseaseName = conditionInfo?.name || 
                                  result.disease.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                  ).join(' ') ||
                                  result.disease.replace(/_/g, ' ');
                



                return (
                  <div key={index} className="condition-card">
                    <div className="condition-info">
                      <h3>{diseaseName}</h3>


                    </div>
                    <div className="progress-circle" style={{'--progress': result.percentage}}>
                      <span className="progress-value">{result.percentage}%</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="condition-card">
                <div className="condition-info">
                  <h3>No Conditions Detected</h3>


                </div>
                <div className="progress-circle" style={{'--progress': 0}}>
                  <span className="progress-value">0%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skin Image */}
        <div className="skin-image-section">
          {capturedImage ? (
            <>
              <img 
                src={capturedImage} 
                alt="Analyzed skin condition" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                  if (placeholder) placeholder.style.display = 'flex';
                }} 
              />
              <div className="image-placeholder" style={{display: 'none'}}>
                <FontAwesomeIcon icon={faImage} className="placeholder-icon" />
                <p>Failed to load image</p>
              </div>
            </>
          ) : (
            <div className="image-placeholder">
              <FontAwesomeIcon icon={faImage} className="placeholder-icon" />
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="results-two-column">
          {/* Left Column - Self-Assessment Answers */}
          <div className="column-left">
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

          {/* Right Column - Recommendations */}
          <div className="column-right">
            <h2 className="section-title">Recommendations</h2>
            <div className="recommendations-list">
              {topPrediction?.recommendations && topPrediction.recommendations.length > 0 ? (
                topPrediction.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <FaCheckCircle className="recommendation-icon" />
                    <span>{typeof rec === "string" ? rec : rec.text}</span>
                  </div>
                ))
              ) : (
                <p>No recommendations available</p>
              )}
            </div>
            <div className="recommendation-note">
              <p>Note: For a more personalized recommendation, contact a professional.</p>
            </div>
            <button className="book-appointment-btn">
              Book an Appointment
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button className="action-btn primary-btn" onClick={handleDownloadReport}>
            <FaDownload /> Download Report as PDF
          </button>
          <button className="action-btn secondary-btn" onClick={() => navigate('/')}>
            <FaHome /> Return Home
          </button>
        </div>
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