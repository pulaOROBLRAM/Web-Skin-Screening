import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowRight, faImage } from '@fortawesome/free-solid-svg-icons';
import './css/ReviewPage.css';

function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [assessmentData, setAssessmentData] = useState(null);
  const [imageData, setImageData] = useState(null);

  const questions = [
    {
      id: 1,
      text: "When was the last time you went out?"
    },
    {
      id: 2,
      text: "How old are you?"
    },
    {
      id: 3,
      text: "How long have you noticed the skin condition?"
    },
    {
      id: 4,
      text: "Is the affected area itchy or painful?"
    },
    {
      id: 5,
      text: "Has the condition changed in appearance recently?"
    }
  ];

  useEffect(() => {
    // Get image from location state (from upload or camera)
    if (location.state?.capturedImage) {
      setImageData(location.state.capturedImage);
    } else if (location.state?.imageData) {
      setImageData(location.state.imageData);
    }
    
    // Get assessment data if available
    const savedAnswers = localStorage.getItem('assessmentAnswers');
    if (savedAnswers) {
      setAssessmentData(JSON.parse(savedAnswers));
    }
  }, [location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    if (imageData) {
      // Navigate to assessment with the image
      navigate('/assessment', {
        state: {
          capturedImage: imageData
        }
      });
    }
  };

  return (
    <div className="review-container">
      {/* Home Button */}
      <button className="home-button" onClick={() => navigate('/')}>
        <FontAwesomeIcon icon={faHome} /> Home
      </button>

      <div className="review-content">
        <div className="preview-card">
          <div className="image-preview">
            {imageData ? (
              <>
                <img
                  src={imageData}
                  alt="Uploaded skin condition"
                  className="uploaded-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
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
                <p>No image uploaded</p>
              </div>
            )}
          </div>
          <div className="preview-actions">
            <button className="preview-btn secondary" onClick={handleBack}>
              Upload Image
            </button>
            <button className="preview-btn secondary" onClick={handleBack}>
              Retry
            </button>
          </div>
        </div>

        <button 
          className="proceed-btn" 
          onClick={handleSubmit}
          disabled={!imageData}
        >
          Proceed with Self-Assessment <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {/* Footer */}
      <footer className="review-footer">
        <div className="footer-left">
          <h3>SkinSight AI</h3>
          <p>Empower Your Skin Health Journey.</p>
          <p>Trusted skin health journey since 2025</p>
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

export default ReviewPage; 