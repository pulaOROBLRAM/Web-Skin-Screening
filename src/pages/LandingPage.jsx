import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera, faListUl, faShieldAlt, faUserGear,
  faCheck, faXmark, faMobileScreen, faUserDoctor, faStethoscope,
  faPhone, faImage, faHome, faInfoCircle, faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

function LandingPage() {
  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  const handleStart = () => {
    navigate('/upload');
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-wrapper">
      {/* Header */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">SkinSight AI</div>

          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#how-to-use">How To Use</a>
          </div>

          <button className="btn-contact" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
            Contact Us
          </button>
        </div>
      </nav>

      <header id="home" className="hero-section">
        <div className="container animate-fade-in">
          <h1 className="hero-title">Empower Your Skin Health Journey</h1>

          <div className="phone-mockup-container">
            <div className="phone-mockup animate-scale-in">
              <FontAwesomeIcon icon={faMobileScreen} className="phone-icon" />
            </div>
          </div>

          <div className="why-intro-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="why-intro-title">Why Use This App? Your Skin Health Matters.</h2>
            <p className="why-intro-text">
              Our application harnesses the power of machine learning to quickly analyze images of your skin.
              By scanning and uploading a photo, you receive an instant assessment for potential signs of
              common skin conditions.
            </p>
          </div>

          <div className="trusted-section">
            <p className="trusted-label">Trusted by</p>
            <div className="brand-logos">
              <div className="logo-placeholder">Logaipsum</div>
              <div className="logo-placeholder">LOGOIPSUM</div>
              <div className="logo-placeholder">logoipsum</div>
              <div className="logo-placeholder">Logaipsum</div>
            </div>
          </div>
        </div>
      </header>

      {/* Why Use This App Section */}
      <section id="about" className="why-section reveal">
        <div className="container">


          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faCamera} />
              </div>
              <h3>Quick & Convenient</h3>
              <p>Upload or take a photo to receive a fast, instant assessment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faListUl} />
              </div>
              <h3>Proactive Care</h3>
              <p>Identify potential issues early and seek professional advice.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h3>Privacy First</h3>
              <p>Our platform is HIPAA compliant. Your data stays private.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faUserGear} />
              </div>
              <h3>Expert Foundation</h3>
              <p>AI-trained models to help with your skin health journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How To Use Section */}
      <section id="how-to-use" className="how-section reveal">
        <div className="container">
          <h2 className="section-title">How To Use</h2>
          <p className="how-intro">
            Get started in seconds. Our interactive process combines high-resolution imaging with detailed symptom analysis to give you the most accurate screening possible.
          </p>


          <div className="how-content">
            <div className="steps-container">
              <div className="step-item reveal" style={{ transitionDelay: '0.1s' }}>
                <span className="step-number">01</span>
                <div className="step-text">
                  <p>Prepare a clear photo of the affected skin area. Tip: Ensure clear lighting, no flash, and sharp focus. Upload or take a photo to start the assessment.</p>
                </div>
              </div>
              <div className="step-item reveal" style={{ transitionDelay: '0.3s' }}>
                <span className="step-number">02</span>
                <div className="step-text">
                  <p>Wait for the model to analyze your image and self-assessment, read the result and suggested recommendations.</p>
                </div>
              </div>
              <div className="step-item reveal" style={{ transitionDelay: '0.5s' }}>
                <span className="step-number">03</span>
                <div className="step-text">
                  <p>Seek professional advice with a dermatologist.</p>
                </div>
              </div>
            </div>
            <div className="how-images">
              <div className="how-icon-container">
                <FontAwesomeIcon icon={faUserDoctor} className="how-icon" />
              </div>
              <div className="how-icon-container">
                <FontAwesomeIcon icon={faStethoscope} className="how-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SkinSight AI Section */}
      <section className="comparison-section reveal">
        <div className="container">
          <h2 className="section-title">Why Choose SkinSight AI?</h2>
          <p className="comparison-subtitle">You need a solution that keeps up. That's why we developed SkinSight AI.</p>
          <button className="btn-start-now" onClick={handleStart}>Start Now</button>

          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-col-header"></div>
              <div className="comparison-col-header">SkinSight AI</div>
              <div className="comparison-col-header">Brand-X WSS</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Ultra-fast browsing</div>
              <div className="comparison-value"><FontAwesomeIcon icon={faCheck} className="check-icon" /></div>
              <div className="comparison-value"><FontAwesomeIcon icon={faCheck} className="check-icon" /></div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Advanced AI insights</div>
              <div className="comparison-value"><FontAwesomeIcon icon={faCheck} className="check-icon" /></div>
              <div className="comparison-value"><FontAwesomeIcon icon={faXmark} className="x-icon" /></div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Seamless integration</div>
              <div className="comparison-value"><FontAwesomeIcon icon={faCheck} className="check-icon" /></div>
              <div className="comparison-value"><FontAwesomeIcon icon={faCheck} className="check-icon" /></div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Advanced AI insights</div>
              <div className="comparison-value"><FontAwesomeIcon icon={faCheck} className="check-icon" /></div>
              <div className="comparison-value"><FontAwesomeIcon icon={faCheck} className="check-icon" /></div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Ultra-fast browsing</div>
              <div className="comparison-value"><FontAwesomeIcon icon={faCheck} className="check-icon" /></div>
              <div className="comparison-value"><FontAwesomeIcon icon={faCheck} className="check-icon" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect with us Section */}
      <section id="contact" className="connect-section reveal">
        <div className="container">
          <h2 className="section-title">Connect with us</h2>
          <div className="connect-content">
            <div className="phone-icon-container">
              <FontAwesomeIcon icon={faPhone} className="phone-3d-icon" />
            </div>
            <div className="contact-form">
              {formStatus === 'success' ? (
                <div className="form-success-message">
                  <div className="success-icon-bg">
                    <FontAwesomeIcon icon={faCheck} className="success-check" />
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. Our team will review your concern and get back to you within 24-48 hours.</p>
                  <button className="btn-send" onClick={() => setFormStatus('')}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" required placeholder="john@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Sex</label>
                    <div className="radio-group">
                      <label>
                        <input type="radio" name="sex" value="female" defaultChecked /> Female
                      </label>
                      <label>
                        <input type="radio" name="sex" value="male" /> Male
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Which best describes your affiliation?</label>
                    <select name="affiliation" defaultValue="current-user">
                      <option value="current-user">Current SkinSight AI User</option>
                      <option value="new-user">New User</option>
                      <option value="medical-professional">Medical Professional</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Concern</label>
                    <textarea name="concern" rows="4" required placeholder="Tell us how we can help..."></textarea>
                  </div>
                  <button type="submit" className="btn-send" disabled={formStatus === 'sending'}>
                    {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#how-to-use">How To Use</a>
              <button className="btn-footer-contact" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
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

      <div className="floating-scan" onClick={handleStart} title="Start Scan">
        <FontAwesomeIcon icon={faCamera} />
      </div>

      <div className="floating-nav">
        <a href="#home" className="nav-icon-link" title="Home">
          <FontAwesomeIcon icon={faHome} />
        </a>
        <a href="#about" className="nav-icon-link" title="About">
          <FontAwesomeIcon icon={faInfoCircle} />
        </a>
        <a href="#how-to-use" className="nav-icon-link" title="How To Use">
          <FontAwesomeIcon icon={faQuestionCircle} />
        </a>
      </div>
    </div>
  );
}

export default LandingPage;
