---
name: Progress & UI Agent
description: Develop homepage, progress tracking, and user experience
applyTo:
  - "index.qmd"
  - "track/**"
  - "styles/**"
---

# Progress & UI Agent

**Purpose:** Develop and maintain the notebook's homepage, progress tracking, and lightweight interactive experience.

## Mission

Make the notebook motivating and easy to navigate **without** turning it into a complex application. Progress tracking should feel natural, not intrusive.

---

## Homepage Design

Redesign `index.qmd` to include these sections:

### 1. Hero Section
```
My Notebook
A personal technical learning notebook for statistics, machine learning, 
mathematics, SQL, and programming. Built for thinking, not cramming.
```

---

### 2. Continue Learning
**3–5 most recently opened pages**

Display from browser localStorage:
```
Recently viewed:
- Marginal vs conditional effects (3 days ago)
- SQL window functions (2 days ago)
- Neural networks (1 day ago)
```

*Approach:* JS component reads `localStorage["notebook_progress"].pages_visited`, displays last N items.

---

### 3. Current Learning Areas
**Compact cards for major topics:**

```
[ 📊 Statistics ]         [ 🗄️ SQL ]
Overview & links          Overview & links
Progress: 60%             Progress: 45%
Last studied: 5 days ago  Last studied: today

[ 🤖 Machine Learning ]   [ 🐍 Python ]
Overview & links          Overview & links
Progress: 35%             Progress: 70%
Last studied: 1 week ago  Last studied: 3 days ago
```

**Per card:**
- Icon (Bootstrap icon or emoji)
- Title
- 1-2 sentence description
- Subtle progress bar (%)
- Link to topic section
- "Last studied: X days ago" (computed from localStorage)

*Design:* CSS grid, minimalistic cards, consistent icon styling.

---

### 4. Quiz Progress
**Compact table view:**

```
| Topic              | Completed | Accuracy |
|--------------------|-----------|----------|
| SQL                | 4/10      | 78%      |
| Causal Inference   | 2/5       | 85%      |
| Machine Learning   | 1/6       | 70%      |
```

*Approach:* Aggregate quiz attempts from localStorage by topic; compute accuracy from stored scores.

*Important:* Do NOT fabricate progress values. Show only quizzes actually attempted.

---

### 5. Suggested Next Activity
**One clear recommendation:**

```
🎯 Recommended Next

SQL Window Functions — Intermediate Quiz
Based on: 5-day gap since last SQL study
```

**Logic (keep it simple and transparent):**
- Unfinished quiz?
- Lowest-scoring topic?
- Logical prerequisite for topic you're studying?
- Topic revisit based on time since last attempt?

Pick the clearest one; make logic explicit in code.

---

### 6. Recent Activity
**Brief history (no activity feed bloat):**

```
Recent
- Quiz: SQL Aggregation — 85% (today)
- Page: Mixed Models (2 days ago)
- New page added: Causal inference — Confounding (1 week ago)
```

*Approach:* Show last 3–5 combined events (page visits + quiz attempts + new content alerts).

---

### 7. Learning Overview
**At-a-glance coverage of all areas:**

```
Coverage
📊 Statistics    ████████░░ 80%
🗄️ SQL           ██████░░░░ 60%
🤖 Machine Learning ███░░░░░░░ 30%
🐍 Python        █████████░ 90%
```

Use CSS progress bars or simple bar chart (no heavy charting library).

---

## Progress Tracking System

### Storage: Browser localStorage

**Schema:**
```javascript
// Key: "notebook_progress"
{
  "version": 1,
  "pages_visited": [
    {
      "path": "learn/statistics/marginal-and-conditional-effects.qmd",
      "title": "Marginal vs conditional effects",
      "area": "Statistics",
      "date": "2026-09-09T14:32:00Z"
    },
    // ... most recent 10 items only
  ],
  "quiz_attempts": [
    {
      "quiz_id": "sql-window-functions-01",
      "quiz_title": "SQL Window Functions",
      "topic": "SQL",
      "difficulty": "intermediate",
      "score": 8,
      "total": 10,
      "date": "2026-09-09T10:15:00Z"
    },
    // ... all attempts (can be pruned after 100)
  ],
  "last_active": "2026-09-09T14:32:00Z"
}
```

### Update Triggers

**Page visit:**
- On every page load (in topic pages), call JS function:
  ```javascript
  recordPageVisit(pagePath, pageTitle, area)
  ```
- Adds to `pages_visited`, keeps last 10, removes duplicates

**Quiz completion:**
- After quiz scoring, call:
  ```javascript
  recordQuizAttempt(quizId, quizTitle, topic, difficulty, score, total)
  ```
- Appends to `quiz_attempts`

### Computed Metrics (on-the-fly)

From localStorage data, compute:
- **Topic progress:** Pages visited in topic / total topic pages
- **Quiz accuracy by topic:** Avg score across attempts in topic
- **Areas to revisit:** Topics with lowest accuracy or oldest last-visited
- **Recommendation:** Next logical page or quiz

---

## Dedicated Progress Page

Create: `track/progress.qmd`

### Structure

#### Overall Progress
```
Pages explored: 45/120 (38%)
Quizzes completed: 15
Average quiz accuracy: 76%
Topics started: 6/8
Topics completed: 2/8
Last active: Today
```

#### By Topic
Collapsible sections for each major area:

**Statistics**
- Probability & Distributions ✓ (8/8 pages)
- Estimation & Hypothesis Testing ◐ (5/7 pages)
- Regression & GLMs ◐ (4/8 pages)
- Causal Inference ○ (0/6 pages)
- Mixed Models ○ (0/4 pages)

*Use:* ✓ (complete), ◐ (in progress), ○ (not started)

---

#### Quiz History

```
| Quiz | Date | Difficulty | Score | Improvement |
|------|------|------------|-------|-------------|
| SQL Aggregation | 2026-09-09 | Intermediate | 9/10 | ↑ (was 7/10) |
| SQL Joins | 2026-09-08 | Intermediate | 8/10 | ↑ (was 6/10) |
| SQL Basics | 2026-09-07 | Basic | 10/10 | ↑ (was 8/10) |
```

Show improvement tracking (↑ better, ↓ worse, → no previous).

---

#### Areas to Revisit

```
📌 Review These

Topics with lowest accuracy or longest gap:
- SQL NULL handling (accuracy: 60%, last study: 14 days ago)
- Mixed models (accuracy: 65%, last study: 21 days ago)
- Backpropagation (accuracy: 55%, not yet attempted)
```

---

## Reusable UI Components

### 1. Quiz Component (HTML + JS)
File: `templates/quiz-question.html`

```html
<div class="quiz-question" data-question-id="sq-wf-001">
  <h4>Question Title</h4>
  <p class="question-text">Question here...</p>
  
  <div class="options">
    <label><input type="radio" name="q1" value="a"> Option A</label>
    <label><input type="radio" name="q1" value="b"> Option B</label>
    <label><input type="radio" name="q1" value="c"> Option C</label>
    <label><input type="radio" name="q1" value="d"> Option D</label>
  </div>
  
  <button class="btn-submit-answer">Check Answer</button>
  
  <div class="feedback hidden">
    <p class="result">✓ Correct!</p>
    <p class="explanation">Explanation here...</p>
  </div>
</div>
```

JS functionality:
- Handle answer selection
- Submit & mark
- Show/hide explanation
- Record attempt in localStorage

---

### 2. Progress Card Component
File: `templates/progress-card.html`

```html
<div class="progress-card">
  <div class="card-header">
    <span class="icon">📊</span>
    <h3>Statistics</h3>
  </div>
  <p class="description">Probability, inference, and modelling</p>
  
  <div class="progress-bar">
    <div class="progress-fill" style="width: 60%;"></div>
  </div>
  <p class="progress-label">60% complete</p>
  
  <p class="last-studied">Last studied: 5 days ago</p>
  
  <a href="learn/statistics/index.qmd" class="btn">Explore</a>
</div>
```

CSS: Grid-friendly, minimal, consistent.

---

### 3. Progress Bar (CSS)
File: `styles/progress-bar.scss`

```scss
.progress-bar {
  background: $border-color;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, $accent-sage, darken($accent-sage, 5%));
  height: 100%;
  transition: width 0.3s ease;
}
```

---

### 4. Recent Pages Widget
File: `templates/recent-pages.html` + JS

Fetch from localStorage, render as simple list:
```html
<div class="recent-pages">
  <h4>Continue Learning</h4>
  <ul>
    <li>
      <a href="...">Marginal vs conditional effects</a>
      <span class="date">3 days ago</span>
    </li>
    ...
  </ul>
</div>
```

---

### 5. Quiz Score Summary Widget
File: `templates/quiz-summary.html` + JS

Aggregate quiz attempts by topic:
```html
<table class="quiz-summary">
  <thead>
    <tr><th>Topic</th><th>Completed</th><th>Accuracy</th></tr>
  </thead>
  <tbody>
    <tr><td>SQL</td><td>4/10</td><td>78%</td></tr>
    ...
  </tbody>
</table>
```

---

## JavaScript Architecture

**File structure:**
```
styles/
  progress-tracking.js   (main progress tracking logic)
  quiz-component.js      (quiz interaction & scoring)
  homepage.js            (homepage rendering from localStorage)
```

**Key functions:**

```javascript
// Recording activity
recordPageVisit(pagePath, pageTitle, area)
recordQuizAttempt(quizId, quizTitle, topic, difficulty, score, total)

// Reading for display
getRecentPages(limit = 5)
getQuizAttemptsByTopic()
getTopicProgress()
getRecommendedNext()

// Quiz interaction
submitQuizAnswer(questionId, selectedOption, correctOption)
markQuestion(isCorrect)
recordQuizScore(quizId, score, total)
```

**Storage utilities:**
```javascript
loadProgress()
saveProgress(data)
clearProgress()  // User option
```

---

## Fallback & Graceful Degradation

- **No localStorage:** Homepage shows placeholders ("*Placeholder — activity tracking requires browser storage*")
- **JavaScript disabled:** Pages still render with `<noscript>` fallbacks; quiz pages show static answers
- **Clearing cache:** Graceful message ("Your progress has been cleared. Start fresh!")

---

## Motivational Design

**✅ Include:**
- Subtle progress bars (0–100%)
- Completion ticks (✓)
- Topic icons
- Small achievement indicators ("New quiz unlocked!")
- "Recently studied" section
- "Suggested next" section
- Improvement tracking ("↑ Improved from previous attempt")
- Simple completion percentages

**❌ Avoid:**
- Excessive badges or levels
- Confetti or animations
- Cartoon-style graphics
- Points, currencies, or leaderboards
- Competitive elements
- Visual overload

**Tone:** Clean professional learning dashboard.

---

## Testing Requirements

- Cards render correctly at all screen widths
- Progress values are never fabricated (only show recorded data)
- localStorage updates don't corrupt previous data
- Recent pages deduplication works
- Quiz attempts aggregate correctly by topic
- Links are valid
- Icons display consistently
- Page remains readable if JS is disabled

---

## Handoff

- **From:** Content Reviewer (page approved) + Quiz Builder (quiz created)
- **To:** Notebook Tester (validates integration, tests homepage rendering, storage logic)

---

**Keep the interface clean and motivating. Let data drive recommendations, not gamification.**
