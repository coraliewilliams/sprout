/**
 * Progress Tracking System
 * 
 * Manages browser localStorage for tracking:
 * - Recently visited pages
 * - Quiz attempts and scores
 * - Topic-level progress
 * 
 * Usage:
 *   - Call recordPageVisit() when a learning page loads
 *   - Call recordQuizAttempt() when a quiz is completed
 *   - Use getters to populate homepage/progress page
 */

const NOTEBOOK_STORAGE_KEY = "notebook_progress";
const MAX_RECENT_PAGES = 10;
const MAX_QUIZ_ATTEMPTS = 100;

/**
 * Initialize or load existing progress data
 */
function loadProgress() {
  try {
    const stored = localStorage.getItem(NOTEBOOK_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to load progress from localStorage:", e);
  }
  
  return {
    version: 1,
    pages_visited: [],
    quiz_attempts: [],
    last_active: null
  };
}

/**
 * Save progress data to localStorage
 */
function saveProgress(data) {
  try {
    localStorage.setItem(NOTEBOOK_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save progress to localStorage:", e);
  }
}

/**
 * Clear all progress data (user action)
 */
function clearProgress() {
  try {
    localStorage.removeItem(NOTEBOOK_STORAGE_KEY);
    console.log("Progress data cleared.");
  } catch (e) {
    console.error("Failed to clear progress:", e);
  }
}

/**
 * Record a page visit
 * @param {string} pagePath - e.g., "learn/statistics/probability-distributions-sampling.qmd"
 * @param {string} pageTitle - e.g., "Probability, Distributions, and Sampling"
 * @param {string} area - e.g., "Statistics"
 */
function recordPageVisit(pagePath, pageTitle, area) {
  const progress = loadProgress();
  
  const visit = {
    path: pagePath,
    title: pageTitle,
    area: area,
    date: new Date().toISOString()
  };
  
  // Remove duplicate path if it exists
  progress.pages_visited = progress.pages_visited.filter(p => p.path !== pagePath);
  
  // Add to front
  progress.pages_visited.unshift(visit);
  
  // Keep only most recent N pages
  progress.pages_visited = progress.pages_visited.slice(0, MAX_RECENT_PAGES);
  
  // Update last active
  progress.last_active = visit.date;
  
  saveProgress(progress);
}

/**
 * Record a quiz attempt
 * @param {string} quizId - e.g., "sql-window-functions-01"
 * @param {string} quizTitle - e.g., "SQL Window Functions"
 * @param {string} topic - e.g., "SQL"
 * @param {string} difficulty - e.g., "intermediate"
 * @param {number} score - e.g., 8
 * @param {number} total - e.g., 10
 */
function recordQuizAttempt(quizId, quizTitle, topic, difficulty, score, total) {
  const progress = loadProgress();
  
  const attempt = {
    quiz_id: quizId,
    quiz_title: quizTitle,
    topic: topic,
    difficulty: difficulty,
    score: score,
    total: total,
    accuracy: Math.round((score / total) * 100),
    date: new Date().toISOString()
  };
  
  // Append attempt
  progress.quiz_attempts.push(attempt);
  
  // Keep only most recent N attempts
  if (progress.quiz_attempts.length > MAX_QUIZ_ATTEMPTS) {
    progress.quiz_attempts = progress.quiz_attempts.slice(-MAX_QUIZ_ATTEMPTS);
  }
  
  // Update last active
  progress.last_active = attempt.date;
  
  saveProgress(progress);
}

/**
 * Get most recent pages visited
 * @param {number} limit - Max pages to return (default: 5)
 * @returns {Array} Array of page visit objects
 */
function getRecentPages(limit = 5) {
  const progress = loadProgress();
  return progress.pages_visited.slice(0, limit);
}

/**
 * Get quiz attempts grouped by topic
 * @returns {Object} e.g., { "SQL": [...attempts], "Statistics": [...attempts] }
 */
function getQuizAttemptsByTopic() {
  const progress = loadProgress();
  const byTopic = {};
  
  progress.quiz_attempts.forEach(attempt => {
    if (!byTopic[attempt.topic]) {
      byTopic[attempt.topic] = [];
    }
    byTopic[attempt.topic].push(attempt);
  });
  
  return byTopic;
}

/**
 * Compute quiz accuracy by topic
 * @returns {Object} e.g., { "SQL": 78, "Statistics": 85 }
 */
function getQuizAccuracyByTopic() {
  const byTopic = getQuizAttemptsByTopic();
  const accuracy = {};
  
  Object.keys(byTopic).forEach(topic => {
    const attempts = byTopic[topic];
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const totalQuestions = attempts.reduce((sum, a) => sum + a.total, 0);
    accuracy[topic] = Math.round((totalScore / totalQuestions) * 100);
  });
  
  return accuracy;
}

/**
 * Get quiz completion count by topic
 * @returns {Object} e.g., { "SQL": 4, "Statistics": 2 }
 */
function getQuizCompletionByTopic() {
  const byTopic = getQuizAttemptsByTopic();
  const completion = {};
  
  Object.keys(byTopic).forEach(topic => {
    completion[topic] = byTopic[topic].length;
  });
  
  return completion;
}

/**
 * Compute topic progress (pages visited)
 * Requires topic pages to have metadata in frontmatter
 * 
 * @returns {Object} e.g., { "Statistics": { visited: 5, total: 10, percent: 50 } }
 */
function getTopicProgress() {
  const progress = loadProgress();
  const byArea = {};
  
  // Group pages by area
  progress.pages_visited.forEach(page => {
    if (!byArea[page.area]) {
      byArea[page.area] = [];
    }
    byArea[page.area].push(page);
  });
  
  // Compute progress per area (will need total from site metadata)
  const topicProgress = {};
  Object.keys(byArea).forEach(area => {
    topicProgress[area] = {
      visited: byArea[area].length
      // total and percent need to come from site/area metadata
    };
  });
  
  return topicProgress;
}

/**
 * Get recommended next activity
 * Simple logic: lowest-scoring quiz topic, or longest gap since last activity
 * 
 * @returns {Object} e.g., { type: "quiz_topic", topic: "SQL", reason: "Lowest accuracy: 60%" }
 */
function getRecommendedNext() {
  const accuracy = getQuizAccuracyByTopic();
  const byTopic = getQuizAttemptsByTopic();
  
  // Find lowest accuracy topic
  let lowestTopic = null;
  let lowestScore = 100;
  
  Object.keys(accuracy).forEach(topic => {
    if (accuracy[topic] < lowestScore) {
      lowestScore = accuracy[topic];
      lowestTopic = topic;
    }
  });
  
  if (lowestTopic) {
    return {
      type: "quiz_topic",
      topic: lowestTopic,
      reason: `Lowest accuracy: ${lowestScore}%`
    };
  }
  
  // If no quizzes, suggest a topic to explore
  return {
    type: "explore",
    suggestion: "Start with SQL basics",
    reason: "High value for interviews"
  };
}

/**
 * Get areas to revisit (lowest accuracy or longest gap)
 * @returns {Array} e.g., [{ topic: "SQL NULL handling", reason: "60% accuracy, 14 days" }]
 */
function getAreasToRevisit() {
  const accuracy = getQuizAccuracyByTopic();
  const byTopic = getQuizAttemptsByTopic();
  const now = new Date();
  
  const revisitCandidates = [];
  
  Object.keys(byTopic).forEach(topic => {
    const attempts = byTopic[topic];
    const lastAttempt = new Date(attempts[attempts.length - 1].date);
    const daysSinceLastAttempt = Math.floor((now - lastAttempt) / (1000 * 60 * 60 * 24));
    
    // Flag if accuracy < 80% or gap > 7 days
    if (accuracy[topic] < 80 || daysSinceLastAttempt > 7) {
      revisitCandidates.push({
        topic: topic,
        accuracy: accuracy[topic],
        daysSinceLast: daysSinceLastAttempt
      });
    }
  });
  
  // Sort by accuracy (lowest first), then by days since last attempt
  revisitCandidates.sort((a, b) => {
    if (a.accuracy !== b.accuracy) {
      return a.accuracy - b.accuracy;
    }
    return b.daysSinceLast - a.daysSinceLast;
  });
  
  return revisitCandidates.slice(0, 5); // Top 5 to revisit
}

/**
 * Format ISO date as relative time (e.g., "2 days ago")
 */
function formatRelativeTime(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  return "Just now";
}

/**
 * Auto-record page visit on page load (if metadata available)
 * Add this to learning pages or call manually
 */
function autoRecordPageVisit() {
  // Extract from Quarto frontmatter or page metadata
  const titleEl = document.querySelector("h1, [data-page-title]");
  const areaEl = document.querySelector("[data-page-area]");
  const pathEl = document.querySelector("[data-page-path]");
  
  if (titleEl && areaEl && pathEl) {
    recordPageVisit(
      pathEl.getAttribute("data-page-path"),
      titleEl.textContent.trim(),
      areaEl.getAttribute("data-page-area")
    );
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    loadProgress,
    saveProgress,
    clearProgress,
    recordPageVisit,
    recordQuizAttempt,
    getRecentPages,
    getQuizAttemptsByTopic,
    getQuizAccuracyByTopic,
    getQuizCompletionByTopic,
    getTopicProgress,
    getRecommendedNext,
    getAreasToRevisit,
    formatRelativeTime,
    autoRecordPageVisit
  };
}
