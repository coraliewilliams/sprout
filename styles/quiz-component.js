/**
 * Quiz Component
 * 
 * Handles quiz interaction:
 * - Answer selection
 * - Marking (right/wrong)
 * - Showing/hiding explanations
 * - Recording attempts in localStorage
 */

class QuizQuestion {
  constructor(element) {
    this.element = element;
    this.questionId = element.getAttribute("data-question-id");
    this.radioInputs = element.querySelectorAll('input[type="radio"]');
    this.checkButton = element.querySelector(".btn-check-answer");
    this.skipButton = element.querySelector(".btn-skip-question");
    this.feedbackDiv = element.querySelector(".feedback");
    this.explanationDiv = element.querySelector(".explanation");
    this.resultDiv = this.feedbackDiv?.querySelector(".result");
    
    this.isAnswered = false;
    this.selectedAnswer = null;
    this.correctAnswer = null;
    
    this.init();
  }
  
  init() {
    if (this.checkButton) {
      this.checkButton.addEventListener("click", () => this.handleSubmit());
    }
    if (this.skipButton) {
      this.skipButton.addEventListener("click", () => this.handleSkip());
    }
    
    // Allow Enter key to submit
    this.radioInputs.forEach(radio => {
      radio.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleSubmit();
        }
      });
    });
  }
  
  handleSubmit() {
    // Get selected answer
    const selected = Array.from(this.radioInputs).find(r => r.checked);
    if (!selected) {
      console.warn("No answer selected");
      return;
    }
    
    this.selectedAnswer = selected.value;
    
    // Get correct answer from data attribute (if available)
    // Or from answer-section metadata
    const answerText = this.explanationDiv?.textContent || "";
    this.correctAnswer = this.extractCorrectAnswer(answerText);
    
    if (!this.correctAnswer) {
      console.warn("Could not determine correct answer");
      return;
    }
    
    // Mark the question
    this.markQuestion();
    
    // Show feedback and explanation
    this.showFeedback();
    
    // Record attempt
    this.recordAttempt();
    
    this.isAnswered = true;
  }
  
  markQuestion() {
    const isCorrect = this.selectedAnswer === this.correctAnswer;
    
    if (this.resultDiv) {
      const correctDiv = this.resultDiv.querySelector(".correct");
      const incorrectDiv = this.resultDiv.querySelector(".incorrect");
      
      if (isCorrect) {
        if (correctDiv) correctDiv.style.display = "block";
        if (incorrectDiv) incorrectDiv.style.display = "none";
      } else {
        if (correctDiv) correctDiv.style.display = "none";
        if (incorrectDiv) incorrectDiv.style.display = "block";
      }
    }
  }
  
  showFeedback() {
    if (this.feedbackDiv) {
      this.feedbackDiv.style.display = "block";
    }
  }
  
  handleSkip() {
    console.log("Question skipped:", this.questionId);
    // TODO: Record skip if needed
  }
  
  extractCorrectAnswer(text) {
    // Simple heuristic: look for "Correct answer: A" or similar
    const match = text.match(/Correct answer[:\s]+([A-D])/i);
    if (match) {
      return match[1].toLowerCase();
    }
    return null;
  }
  
  recordAttempt() {
    const isCorrect = this.selectedAnswer === this.correctAnswer;
    const score = isCorrect ? 1 : 0;
    
    // TODO: Record in quiz-level tracking
    // This is called per question; quiz-level component aggregates
    console.log("Question attempt recorded:", {
      questionId: this.questionId,
      selected: this.selectedAnswer,
      correct: this.correctAnswer,
      isCorrect: isCorrect,
      score: score
    });
  }
}

/**
 * Initialize all quiz questions on the page
 */
function initQuizQuestions() {
  const questions = document.querySelectorAll(".quiz-question");
  questions.forEach(q => new QuizQuestion(q));
}

/**
 * Quiz Score Tracker
 * Aggregates all questions on a quiz page and records final score
 */
class QuizScoreTracker {
  constructor(quizId, quizTitle, topic, difficulty) {
    this.quizId = quizId;
    this.quizTitle = quizTitle;
    this.topic = topic;
    this.difficulty = difficulty;
    this.attempts = [];
    this.currentScore = 0;
    this.totalQuestions = 0;
  }
  
  recordQuestionScore(questionId, isCorrect) {
    this.attempts.push({
      questionId: questionId,
      isCorrect: isCorrect
    });
    
    if (isCorrect) {
      this.currentScore += 1;
    }
    this.totalQuestions += 1;
  }
  
  finalize() {
    // Record quiz attempt in localStorage
    if (typeof recordQuizAttempt === "function") {
      recordQuizAttempt(
        this.quizId,
        this.quizTitle,
        this.topic,
        this.difficulty,
        this.currentScore,
        this.totalQuestions
      );
    }
    
    return {
      score: this.currentScore,
      total: this.totalQuestions,
      accuracy: Math.round((this.currentScore / this.totalQuestions) * 100)
    };
  }
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initQuizQuestions);
} else {
  initQuizQuestions();
}
