# Multi-Agent Workflow — Implementation Guide

## ✅ What's Been Implemented

### 1. Six VS Code Agents (`.github/agents/`)
- **Notebook Planner** (`notebook-planner.agent.md`) — Curriculum strategist
- **Page Builder** (`page-builder.agent.md`) — Implements pages with rigor and clarity
- **Content Reviewer** (`content-reviewer.agent.md`) — Technical & pedagogical review
- **Quiz Builder** (`quiz-builder.agent.md`) — Builds screening-interview quizzes
- **Progress & UI Agent** (`progress-ui.agent.md`) — Homepage, progress tracking, UI
- **Notebook Tester** (`notebook-tester.agent.md`) — Validation & testing

### 2. Reusable Components
- **Quiz Question Component** (`templates/quiz-question.html`) — Answer selection, marking, explanation
- **Progress Card Component** (`templates/progress-card.html`) — Topic overview cards
- **Progress Bar** (CSS in `progress-card.html`) — Visual progress indicators

### 3. JavaScript Infrastructure (`styles/`)
- **`progress-tracking.js`** — Browser localStorage API
  - `recordPageVisit()` — Log page visits
  - `recordQuizAttempt()` — Log quiz attempts
  - `getRecentPages()`, `getQuizAttemptsByTopic()`, `getQuizAccuracyByTopic()`, etc.
  - `getAreasToRevisit()` — Recommend review topics

- **`quiz-component.js`** — Quiz interactivity
  - `QuizQuestion` class — Answer selection, marking, feedback
  - Auto-initialize on page load
  - Record attempts in localStorage

- **`homepage.js`** — Homepage rendering
  - `renderContinueLearning()` — Recent pages
  - `renderQuizProgress()` — Accuracy by topic
  - `renderSuggestedNext()` — Recommendation engine
  - `renderRecentActivity()` — Timeline view
  - `renderLearningOverview()` — Coverage by area

### 4. Enhanced Homepage (`index.qmd`)
- Continue Learning section (recent pages)
- Current Learning Areas cards (Statistics, SQL, ML, Python)
- Quiz Progress table (accuracy tracking)
- Suggested Next Activity (recommendation)
- Recent Activity timeline
- Learning Overview progress bars

### 5. Dedicated Progress Page (`track/progress.qmd`)
- Overall progress stats
- Progress by topic (grid view)
- Quiz history table (with improvement tracking)
- Areas to revisit (with reason)
- Clear progress option

### 6. Testing Infrastructure (`tests/`)
- **`tests/README.md`** — Testing guide and setup instructions
- **`tests/quarto/test_render.py`** — Quarto rendering validation, YAML checks
- **`tests/sql/fixtures.py`** — DuckDB test fixtures (orders, customers, events, etc.)
- **`tests/sql/test_joins_null.py`** — SQL correctness tests (JOINs, NULL, GROUP BY, window functions)
- **`tests/conftest.py`** — pytest configuration

### 7. Updated Configuration
- **`_quarto.yml`** — Updated Track section to include progress.qmd
- **`track/index.qmd`** — Updated with progress page description

---

## 🚀 How to Use the Agents

### Typical Workflow

```
1. Notebook Planner proposes new content
   ↓ [You review & approve]
   ↓
2. Page Builder implements the page
   ↓
3. Content Reviewer checks for errors
   ↓ [If issues: Page Builder fixes]
   ↓
4. Quiz Builder creates/updates quiz
   ↓
5. Progress & UI Agent ensures integration
   ↓
6. Notebook Tester validates everything
   ↓
7. Ready to commit & publish
```

### Using Each Agent

#### Notebook Planner
**When:** You want to plan next learning content

**How:** Ask the planner to:
- "What should be the next SQL topic?"
- "Identify gaps in our causal inference coverage"
- "Propose 3 machine learning pages we're missing"

**Output:** Structured proposals with prerequisites, objectives, estimated length, and file impact

---

#### Page Builder
**When:** You have an approved proposal ready to implement

**How:** Ask the builder to:
- "Implement the proposed page on SQL window functions"
- "Add section on PyTorch neural network basics"
- "Improve the causal inference DAG explanation"

**Pre-implementation:** Builder inspects:
1. Related existing pages (avoid duplication)
2. Repository conventions (metadata, style)
3. Minimal sensible change

**Result:** New page with correct frontmatter, structure, code examples, and visual elements

---

#### Content Reviewer
**When:** Page is complete and needs technical check

**How:** Ask the reviewer to:
- "Review the mixed models page for statistical correctness"
- "Check SQL queries for NULL handling and correctness"
- "Verify ML evaluation methodology"

**Output:** Structured report with:
- 🔴 Critical issues (must fix)
- 🟠 Important improvements (strongly recommended)
- 🟡 Minor suggestions (optional)
- ✅ Passed checks (what's sound)

---

#### Quiz Builder
**When:** A learning page is complete and needs quizzes

**How:** Ask the builder to:
- "Create a 10-question SQL window functions quiz"
- "Build interview-prep questions for causal inference"
- "Add debugging questions to the ML validation quiz"

**Output:** Quiz page with:
- Multiple choice, code-output, debugging, scenario questions
- Hidden answers (revealed on-demand)
- Metadata for progress tracking
- Related learning page links

---

#### Progress & UI Agent
**When:** Need to update homepage, progress tracking, or UI

**How:** Ask the agent to:
- "Update the homepage to show 10 most recent topics"
- "Add a new progress card for a topic area"
- "Fix the quiz progress calculation"

**Output:** Updated HTML/CSS/JS with localStorage integration

---

#### Notebook Tester
**When:** Changes are ready for validation

**How:** Ask the tester to:
- "Run full test suite"
- "Validate all SQL examples with DuckDB"
- "Check for broken links after reorganization"

**Output:** Structured test report with:
- ✅ Pass/fail for each category
- ⚠️ Warnings
- 🔴 Failures (with details)
- Summary of what passed

---

## 📊 Progress Tracking System

### How It Works

**Storage:** Browser's `localStorage` (no backend needed)

**Tracked:**
- Page visits: `path`, `title`, `area`, `date`
- Quiz attempts: `quiz_id`, `score`, `total`, `accuracy`, `date`
- Computed on-the-fly: topic accuracy, recent pages, recommendations

**Persistence:**
- ✅ Survives browser close
- ❌ Lost if cache is cleared
- ❌ Not synced across devices
- ❌ No automatic backup

### Using Progress Data

From any page, call:

```javascript
// Get recent pages
const recent = getRecentPages(5);
console.log(recent); // [{path: "...", title: "...", date: "..."}, ...]

// Get quiz accuracy by topic
const accuracy = getQuizAccuracyByTopic();
console.log(accuracy); // {"SQL": 78, "Statistics": 85}

// Get recommended next activity
const next = getRecommendedNext();
console.log(next); // {type: "quiz_topic", topic: "SQL", reason: "Lowest accuracy: 60%"}
```

### Recording Activity

On learning pages, the homepage auto-records visits via:
```javascript
recordPageVisit(pagePath, pageTitle, area);
```

In quizzes, record attempts via:
```javascript
recordQuizAttempt(quizId, quizTitle, topic, difficulty, score, total);
```

---

## 🧪 Running Tests

### Quick Start
```bash
cd /path/to/my-notebook

# Install dependencies
pip install pytest duckdb

# Run all tests
pytest tests/ -v

# Run specific category
pytest tests/quarto/ -v     # Quarto rendering
pytest tests/sql/ -v         # SQL correctness
```

### What Gets Tested

| Test | What | Coverage |
|------|------|----------|
| **Quarto render** | Full site render | All pages render without error |
| **YAML frontmatter** | Metadata validity | Area, status, confidence, dates correct |
| **SQL tests** | Query correctness | JOINs, NULL, GROUP BY, window functions |
| **Python tests** | Syntax & execution | (Optional; use if executing code) |

---

## 🎨 Customizing Visuals

### Colors & Theme
Edit `styles/custom.scss`:
- `$accent-sage` — Primary (links, accents)
- `$accent-blue` — Secondary (notes)
- `$accent-terracotta` — Important (warnings)
- `$accent-ochre` — Alerts

### Icons
Bootstrap icons are built into Quarto. Use in cards/callouts:
```html
<span class="card-icon">📊</span> <!-- Or use Bootstrap icon classes -->
```

### Progress Bar Animation
CSS transition in `progress-card.html` — adjust `transition: width 0.3s ease` to change speed.

---

## 📝 Example: Adding a New Quiz

**1. Page Builder** creates `learn/programming-computing/sql-advanced.qmd` ✅

**2. Quiz Builder** creates `practise/quizzes/sql-advanced.qmd`
   - 5–10 questions
   - Metadata with ID, topic, difficulty
   - Related learning page link
   - Hidden answers with explanations

**3. Quiz page includes**:
```html
<script src="../../styles/quiz-component.js"></script>
```

**4. Each question uses**:
```html
<div class="quiz-question" data-question-id="sql-adv-001">
  <!-- Question HTML from component template -->
</div>
```

**5. On page load**:
   - JS auto-initializes QuizQuestion instances
   - Records attempts in localStorage
   - Homepage auto-updates quiz progress

**6. Notebook Tester** validates:
   - Question IDs unique
   - All questions have explanations
   - Related page link valid

---

## 🔍 Troubleshooting

### "Module 'progress_tracking' not found"
- Ensure `styles/progress-tracking.js` is loaded before using functions
- Add `<script src="styles/progress-tracking.js"></script>` to page

### Progress not showing on homepage
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify localStorage is not disabled

### Quiz answers not revealing
- Check `quiz-component.js` is loaded
- Verify quiz page structure matches component template
- Look at browser console for JS errors

### Tests fail with "No such file or directory"
- Run from repository root: `cd /path/to/my-notebook`
- Ensure `tests/` directory exists with all subdirectories
- Verify `pytest` and `duckdb` are installed

---

## 📚 Next Steps

### Immediate (Phase 1)
1. ✅ Test homepage by opening `index.qmd` locally
2. ✅ Create a test quiz using `templates/quiz-question.html`
3. ✅ Run test suite: `pytest tests/ -v`
4. ✅ Commit agent files and infrastructure

### Short-term (Phase 2)
1. Use **Notebook Planner** to identify next 3 high-value pages
2. Use **Page Builder** to implement one page
3. Use **Content Reviewer** to check it
4. Use **Quiz Builder** to add a quiz
5. Use **Notebook Tester** to validate

### Medium-term (Phase 3)
1. Implement CI/CD: Add `.github/workflows/test.yml` (with your approval)
2. Expand test coverage (more SQL tests, Python tests if executing)
3. Refine recommendation logic in `getRecommendedNext()`

### Long-term (Phase 4)
1. Consider optional: Quiz scoring UI enhancements
2. Consider optional: Data export (download quiz history)
3. Consider optional: Sharing progress snapshot (no backend)

---

## 🤝 Collaborating with Agents

**Best Practices:**
- Be specific about what you want (avoid "improve the notebook")
- Provide context (is this a new topic or refactoring existing?)
- Ask agents to inspect first, then implement
- Use agents' output to understand trade-offs before approving major changes
- Keep communication in agent files (AGENT_ARCHITECTURE.md) for future reference

**Keeping Agents in Sync:**
- All agents know about the reusable components (quiz, progress cards, JS functions)
- Topic metadata schema is documented (frontmatter spec in Page Builder agent)
- Testing expectations are clear (Notebook Tester expectations)
- UI/UX guidelines are consistent (minimalistic, no gamification, professional)

---

## 📞 Support

If something isn't working:
1. Check the relevant agent's documentation (first section of each `.agent.md`)
2. Review `tests/README.md` for test-related issues
3. Inspect browser console for JS errors
4. Verify file paths and locations match repository structure
5. Ensure all dependencies are installed (`pytest`, `duckdb`, `quarto`)

---

**Ready to start? Pick one agent to use first, and let the workflow guide you.**
