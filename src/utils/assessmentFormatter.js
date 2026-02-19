import { BASE_QUESTIONS } from '../pages/selfAssessmentQuestions';

/**
 * Convert assessment data to displayable format.
 * Uses personalized questions from SelfAssessment when provided so displayed Q&A matches what the user saw.
 * @param {Object} assessmentData - Assessment answers object (e.g. { 1: "Yes", 2: "Not at all" })
 * @param {Array} [personalizedQuestions] - Optional questions array from SelfAssessment (same order and ids as during assessment)
 * @returns {Array} - Array of { question, answer, questionId } in assessment order
 */
export function formatAssessmentAnswers(assessmentData, personalizedQuestions) {
  if (!assessmentData || Object.keys(assessmentData).length === 0) {
    return [];
  }

  if (Array.isArray(personalizedQuestions) && personalizedQuestions.length > 0) {
    return personalizedQuestions
      .filter((q) => assessmentData[q.id] !== undefined && assessmentData[q.id] !== '')
      .map((q) => ({
        question: q.text || `Question ${q.id}`,
        answer: assessmentData[q.id],
        questionId: q.id
      }));
  }

  return Object.entries(assessmentData).map(([key, value]) => {
    const questionId = parseInt(key, 10);
    const questionData = BASE_QUESTIONS[questionId];
    return {
      question: questionData?.text || `Question ${key}`,
      answer: value,
      questionId
    };
  });
}
