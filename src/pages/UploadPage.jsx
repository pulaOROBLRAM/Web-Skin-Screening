import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload, faCamera, faArrowRight, faUndo, faSpinner, faHome, faImage } from '@fortawesome/free-solid-svg-icons';
import './css/UploadPage.css';

function UploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSource, setImageSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // If arriving from camera flow, reuse the captured image.
    if (location.state?.capturedImage) {
      setSelectedImage(location.state.capturedImage);
      setImageSource('camera');
    }
  }, [location.state]);

  const handleCameraClick = () => {
    navigate('/camera');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImageSource('upload');
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setError('Please upload a valid image file.');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleProceed = async () => {
    if (!selectedImage) {
      setError('No image selected. Please upload an image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const file = dataURLtoFile(selectedImage, 'skin-input.jpg');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Model inference failed (${response.status})`);
      }

      const modelPrediction = await response.json();

      navigate('/assessment', {
        state: {
          capturedImage: selectedImage,
          modelPrediction
        }
      });
    } catch (err) {
      console.error('Model prediction error:', err);
      setError('Connection to AI Model failed. Ensure the Python backend is running on port 5000 and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageSource('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-wrapper">
      {/* Header */}
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

      <main className="upload-main-content">
        {!selectedImage ? (
          <div className="container">
            <header className="upload-header-section">
              <h1 className="upload-main-title">Start Your Assessment</h1>
              <p className="upload-main-subtitle">Choose how you'd like to provide your skin image for analysis.</p>
            </header>

            <div className="upload-hub">
              <div 
                className={`drop-zone-container ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="drop-zone-content">
                  <div className="hub-icon-wrapper">
                    <FontAwesomeIcon icon={faCloudUpload} />
                  </div>
                  <h2 className="hub-title">Drag & Drop Your Image</h2>
                  <p className="hub-subtitle">High-quality photos provide better assessment accuracy</p>
                  
                  <div className="hub-divider">
                    <span>OR</span>
                  </div>

                  <div className="hub-actions">
                    <div className="action-wrapper">
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="file-upload"
                        className="file-input-hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-upload" className="hub-btn hub-btn-primary">
                        <FontAwesomeIcon icon={faImage} style={{ marginRight: '10px' }} />
                        Browse Files
                      </label>
                    </div>

                    <button className="hub-btn hub-btn-camera" onClick={handleCameraClick}>
                      <FontAwesomeIcon icon={faCamera} style={{ marginRight: '10px' }} />
                      Use Camera
                    </button>
                  </div>
                </div>
                
                {/* Visual feedback for dragging */}
                {isDragging && (
                  <div className="drag-overlay">
                    <div className="overlay-content">
                      <FontAwesomeIcon icon={faCloudUpload} bounce />
                      <p>Drop to start analysis</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="upload-guidelines">
              <h3>
                <FontAwesomeIcon icon={faImage} style={{ marginRight: '10px', color: 'var(--primary-blue)' }} />
                Image Guidelines
              </h3>
              <ul>
                <li>Ensure the area is well-lit with natural light if possible.</li>
                <li>Avoid using camera flash to prevent overexposure.</li>
                <li>Keep the camera steady and ensure the image is sharp and in focus.</li>
                <li>Center the affected area in the middle of the frame.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="preview-layout">
              <div className="preview-image-box">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="main-preview-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const placeholder = e.target.nextElementSibling;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div className="image-placeholder-box" style={{ display: 'none' }}>
                  <FontAwesomeIcon icon={faImage} className="placeholder-icon" />
                  <p>Failed to load image</p>
                </div>
              </div>

              <div className="preview-info-panel">
                <h2 className="preview-title">Image Ready</h2>
                <p className="preview-desc">Review your photo before proceeding to view your results.</p>

                <div className="preview-actions-group">
                  <button
                    className="btn-secondary-outline"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faUndo} /> Retake / Another
                  </button>

                  <button
                    className="btn-primary-action"
                    onClick={handleProceed}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin /> Analyzing...
                      </>
                    ) : (
                      <>
                        Continue to Results <FontAwesomeIcon icon={faArrowRight} />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="analysis-error-box">
                    <strong>
                      <FontAwesomeIcon icon={faUndo} style={{ marginRight: '8px' }} />
                      Analysis Error
                    </strong>
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
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

export default UploadPage; 