/**
 * Report generation utilities
 * Handles creation and download of analysis reports
 */

/**
 * Generate HTML report content
 * @param {string} capturedImage - Base64 image data
 * @returns {string} - HTML report content
 */
export function generateReportHTML(capturedImage) {
  return `
    <html>
      <head>
        <title>Skin Analysis Report</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 2rem; 
            background: #f5f5f5;
          }
          .header {
            text-align: center;
            margin-bottom: 2rem;
            border-bottom: 2px solid #333;
            padding-bottom: 1rem;
          }
          .section { 
            margin-bottom: 2rem; 
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .condition { 
            margin-bottom: 1rem; 
            background: #f5f5f5; 
            padding: 1rem;
            border-left: 4px solid #007bff;
          }
          .note { 
            font-style: italic; 
            color: #666; 
            margin-top: 10px;
            padding: 1rem;
            background: #e9ecef;
            border-radius: 4px;
          }
          img {
            max-width: 100%;
            height: auto;
            margin: 1rem 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Skin Analysis Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="section">
          <h2>Analyzed Image</h2>
          <img src="${capturedImage}" alt="Analyzed skin condition" width="400"/>
        </div>
        
        <div class="section">
          <div class="note">
            Note: This analysis is for informational purposes only. 
            Please consult a medical professional for accurate diagnosis and treatment.
          </div>
        </div>
        
        <footer style="text-align: center; margin-top: 3rem; color: #666; border-top: 1px solid #ddd; padding-top: 1rem;">
          <p>© 2025 SkinSight AI. This report was automatically generated.</p>
        </footer>
      </body>
    </html>
  `;
}

/**
 * Download report as HTML file
 * @param {string} htmlContent - HTML content to download
 * @param {Date} generatedDate - Date when report was generated
 */
export function downloadReportFile(htmlContent, generatedDate = new Date()) {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `skin-analysis-${generatedDate.toISOString().split('T')[0]}.html`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generate and download report in one step
 * @param {string} capturedImage - Base64 image data
 */
export function generateAndDownloadReport(capturedImage) {
  const htmlContent = generateReportHTML(capturedImage);
  downloadReportFile(htmlContent);
}
