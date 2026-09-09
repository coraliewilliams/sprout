/**
 * Homepage Rendering
 * 
 * Populates homepage sections with data from localStorage:
 * - Continue learning
 * - Quiz progress
 * - Recommended next activity
 * - Recent activity
 */

/**
 * Render "Continue Learning" section
 */
function renderContinueLearning() {
  const container = document.getElementById("continue-learning");
  if (!container) return;
  
  const pages = getRecentPages(5);
  
  if (pages.length === 0) {
    container.innerHTML = '<p class="placeholder">*Start exploring to see your recently visited pages here.*</p>';
    return;
  }
  
  let html = '<ul class="recent-pages-list">';
  pages.forEach(page => {
    html += `
      <li>
        <a href="${page.path}">${page.title}</a>
        <span class="date">${formatRelativeTime(page.date)}</span>
      </li>
    `;
  });
  html += '</ul>';
  
  container.innerHTML = html;
}

/**
 * Render "Quiz Progress" table
 */
function renderQuizProgress() {
  const container = document.getElementById("quiz-progress-table");
  if (!container) return;
  
  const accuracy = getQuizAccuracyByTopic();
  const completion = getQuizCompletionByTopic();
  
  if (Object.keys(accuracy).length === 0) {
    container.innerHTML = '<p class="placeholder">*Complete a quiz to see your progress here.*</p>';
    return;
  }
  
  let html = `
    <table class="quiz-progress-table">
      <thead>
        <tr>
          <th>Topic</th>
          <th>Completed</th>
          <th>Accuracy</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  Object.keys(completion).forEach(topic => {
    html += `
      <tr>
        <td>${topic}</td>
        <td>${completion[topic]} quiz${completion[topic] > 1 ? "zes" : ""}</td>
        <td>${accuracy[topic]}%</td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  container.innerHTML = html;
}

/**
 * Render "Suggested Next Activity"
 */
function renderSuggestedNext() {
  const container = document.getElementById("suggested-next");
  if (!container) return;
  
  const recommendation = getRecommendedNext();
  
  let html = '<div class="suggested-next-box">';
  html += '<strong>🎯 Recommended Next</strong><br/>';
  
  if (recommendation.type === "quiz_topic") {
    html += `<p>${recommendation.topic} Quiz — ${recommendation.reason}</p>`;
    html += `<p class="small">Topics with lower accuracy benefit from review and practice.</p>`;
  } else {
    html += `<p>${recommendation.suggestion}</p>`;
    html += `<p class="small">${recommendation.reason}</p>`;
  }
  
  html += '</div>';
  
  container.innerHTML = html;
}

/**
 * Render "Recent Activity"
 */
function renderRecentActivity() {
  const container = document.getElementById("recent-activity");
  if (!container) return;
  
  const progress = loadProgress();
  const allEvents = [];
  
  // Combine pages and quizzes into single timeline
  progress.pages_visited.slice(0, 5).forEach(page => {
    allEvents.push({
      type: "page",
      title: page.title,
      date: page.date,
      label: "Page"
    });
  });
  
  progress.quiz_attempts.slice(0, 5).forEach(attempt => {
    allEvents.push({
      type: "quiz",
      title: attempt.quiz_title,
      score: attempt.score,
      total: attempt.total,
      date: attempt.date,
      label: "Quiz"
    });
  });
  
  // Sort by date (most recent first)
  allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (allEvents.length === 0) {
    container.innerHTML = '<p class="placeholder">*Your activity will appear here.*</p>';
    return;
  }
  
  let html = '<ul class="activity-list">';
  allEvents.slice(0, 5).forEach(event => {
    if (event.type === "page") {
      html += `
        <li>
          <strong>Page:</strong> ${event.title}
          <span class="date">${formatRelativeTime(event.date)}</span>
        </li>
      `;
    } else if (event.type === "quiz") {
      html += `
        <li>
          <strong>Quiz:</strong> ${event.title} — ${event.score}/${event.total}
          <span class="date">${formatRelativeTime(event.date)}</span>
        </li>
      `;
    }
  });
  html += '</ul>';
  
  container.innerHTML = html;
}

/**
 * Render "Learning Overview" progress bars
 */
function renderLearningOverview() {
  const container = document.getElementById("learning-overview");
  if (!container) return;
  
  // Static for now; would need total page counts from site metadata
  const areas = ["Statistics", "SQL", "Machine Learning", "Python"];
  const completion = getQuizCompletionByTopic();
  
  let html = '<div class="learning-overview">';
  
  areas.forEach(area => {
    const quizzesCompleted = completion[area] || 0;
    const percent = Math.min(quizzesCompleted * 10, 100); // Rough estimate
    
    html += `
      <div class="overview-item">
        <div class="overview-label">
          <strong>${area}</strong>
          <span class="percent">${percent}%</span>
        </div>
        <div class="progress-bar-small">
          <div class="progress-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
}

/**
 * Render all homepage sections
 */
function renderHomepage() {
  renderContinueLearning();
  renderQuizProgress();
  renderSuggestedNext();
  renderRecentActivity();
  renderLearningOverview();
}

/**
 * Run on DOM ready
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderHomepage);
} else {
  renderHomepage();
}

// Style for homepage sections
const homepageStyles = `
<style>
.recent-pages-list, .activity-list {
  list-style: none;
  padding: 0;
}

.recent-pages-list li, .activity-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color, #dfdcd3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-pages-list li:last-child, .activity-list li:last-child {
  border-bottom: none;
}

.recent-pages-list a {
  color: var(--accent-sage, #5b7a6b);
  text-decoration: none;
  font-weight: 500;
}

.recent-pages-list a:hover {
  text-decoration: underline;
}

.date {
  font-size: 0.85rem;
  color: var(--text-secondary, #6f7477);
  margin-left: 1rem;
  white-space: nowrap;
}

.quiz-progress-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.quiz-progress-table th, .quiz-progress-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color, #dfdcd3);
}

.quiz-progress-table th {
  font-weight: 600;
  background: var(--sidebar-bg, #f1f4ef);
}

.quiz-progress-table tbody tr:hover {
  background: rgba(0, 0, 0, 0.02);
}

.suggested-next-box {
  padding: 1rem;
  background: var(--surface-bg, #f3f2ed);
  border-left: 3px solid var(--accent-sage, #5b7a6b);
  border-radius: 3px;
  margin: 1rem 0;
}

.suggested-next-box p {
  margin: 0.5rem 0;
}

.suggested-next-box .small {
  font-size: 0.85rem;
  color: var(--text-secondary, #6f7477);
}

.learning-overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1rem 0;
}

.overview-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.overview-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.overview-label .percent {
  font-weight: 600;
  color: var(--accent-sage, #5b7a6b);
}

.progress-bar-small {
  width: 100%;
  height: 4px;
  background: var(--border-color, #dfdcd3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-small .progress-fill {
  background: linear-gradient(90deg, var(--accent-sage, #5b7a6b), #4a6b5c);
  height: 100%;
  transition: width 0.3s ease;
}

.placeholder {
  color: var(--text-secondary, #6f7477);
  font-style: italic;
  padding: 1rem 0;
}
</style>
`;

// Inject styles into page
if (document.head) {
  const styleEl = document.createElement("style");
  styleEl.textContent = homepageStyles.match(/<style>([\s\S]*)<\/style>/)[1];
  document.head.appendChild(styleEl);
}
