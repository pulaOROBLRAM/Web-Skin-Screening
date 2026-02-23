/*
  Configuration for the WSS Application.
  This file contains instance-specific settings.
  
  Instructions for deployment:
  - Update the BOOKING_URL to point to the specific clinic's booking page.
*/

export const CONFIG = {
  // The URL where the "Book Appointment" button should redirect.
  // Example: https://dermatologysolutions.as.me/schedule/d6bc36cb
  BOOKING_URL: "https://dermatologysolutions.as.me/schedule/d6bc36cb",
  
  // Report Download Configuration
  REPORT_SETTINGS: {
    includeImage: true,
    includeRecommendations: true,
    includeAssessmentAnswers: true,
    includeAnalysisNotes: true, // You can toggle this to false to hide it from PDFs
    primaryColor: "#1e3a8a",
    companyName: "SkinSight AI"
  }
};
