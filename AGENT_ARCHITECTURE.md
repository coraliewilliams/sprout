# Multi-Agent Workflow Architecture

**Status:** Proposal for review (awaiting approval)

---

## Repository Inspection Summary

### Current State

**Existing infrastructure:**
- Quarto static site (docked sidebar, cosmo theme + custom SCSS)
- Three main sections: Learn (7 areas), Practise (worked examples, coding, quizzes), Track
- Rich YAML frontmatter on all topic pages: `status`, `confidence`, `last-reviewed`, `practice`, `quiz`
- Page Tracker auto-generated from frontmatter metadata
- Quiz pages are static Quarto with collapsible answers
- GitHub Actions CI (quarto render → GitHub Pages)
- Custom color palette (sage, blue, terracotta, ochre)
- Topic template exists with clear structure
- Bootstrap/Quarto icons available

**Gaps:**
- No Copilot agent definitions
- No progress tracking system (homepage placeholders remain)
- Learning Tracker is a placeholder
- No client-side quiz scoring/progress
- No testing infrastructure

---

## Proposed Six Agents

All agents to be created under `.github/agents/` with clear responsibilities and collaborative handoff patterns.

### 1. `notebook-planner.agent.md`

**Purpose:** Curriculum and architecture planner.

**Responsibilities:**
- Inspect existing content before suggesting new pages
- Identify knowledge gaps against user's priorities (causal inference, SQL, ML, Python)
- Propose next learning page with clear justification
- Check for duplication and unmet prerequisites
- Decide single page vs. multiple subpages for large topics
- Consider interview preparation value

**Output format (for proposed pages):**
```
### Proposed page
**Topic:** [name]
**Why it belongs:** [justification + priority alignment]
**Prerequisites:** [list related pages]
**Learning objectives:** [3–5 bullets]
**Sections:** [outline structure]
**Code examples:** [languages needed]
**Quiz opportunity:** [what to test]
**Approximate length:** Short / Medium
**Files affected:** [list files to create/update]
```

**Handoff:** Approved proposals → Page Builder

---

### 2. `page-builder.agent.md`

**Purpose:** Implement concise, technically rigorous learning pages.

**Pre-implementation checklist:**
1. Inspect related existing pages
2. Review repository conventions (metadata, structure, terminology)
3. Check for duplication
4. Identify minimal sensible change

**Writing style:**
- Concept → intuition → example → code → interpretation → key takeaway
- Concise, scannable, technically accurate
- Quantitative/statistical background assumed
- Application-oriented, not textbook

**Language choices:**
- R for statistics/causal inference
- Python for ML
- PyTorch for neural networks/deep learning
- SQL for database topics

**Code examples:**
- Short enough to understand completely
- Include assumptions where needed
- Highlight common mistakes
- Provide interpretation guidance

**Special care for:**
- Causal/mixed-model terminology (conditional vs. marginal vs. subject-specific vs. population-average effects)
- Distinction between what model estimates and what data are used
- Don't invent APIs—use only real, documented functions

**Visual elements:**
- Use only when they aid comprehension
- Prefer existing Bootstrap/Quarto icons
- Mermaid for simple diagrams
- Lightweight SVG/CSS cards
- Keep minimalistic, scientific style
- Avoid decorative clutter

**Related metadata:** Topic page should have correct `area`, `status`, `confidence`, `last-reviewed`

---

### 3. `content-reviewer.agent.md`

**Purpose:** Independent technical reviewer (review-first, not rewrite-first).

**Review categories:**

**Critical (must fix):**
- Mathematical/statistical incorrectness
- SQL errors or misleading examples
- Python/R package API misuse
- Wrong terminology

**Important (materially improves understanding):**
- Missing key assumptions
- Insufficient interpretation guidance
- Pedagogy issues (too brief, too detailed, misleading)
- Visual clarity problems

**Minor (optional):**
- Phrasing improvements
- Consistency tweaks
- Stylistic refinement

**Special focus areas:**
- Causal inference correctness (confounding, adjustment sets, identifiability)
- Mixed models (what is conditional/marginal/subject-specific/population-average)
- Machine learning (validation, leakage, bias/variance)
- SQL (NULL, JOINs, GROUP BY edge cases)
- Data interpretation vs. code correctness

**Output:**
Structured report: **Critical** | **Important** | **Minor** | **Passed checks**

If no material problems: explicitly state page passes review.

---

### 4. `quiz-builder.agent.md`

**Purpose:** Build concise quizzes for learning, revision, and interview prep.

**Design principles:**
- Test reasoning and application, not definitions
- 5–10 questions per quiz
- Mix: multiple choice, code-output, debugging, scenarios, best-analysis
- Plausible wrong answers (avoid obvious distractors)

**Topic focus (in priority order):**

**SQL (highest interview focus):**
- Query output prediction
- JOIN/NULL/GROUP BY/HAVING behavior
- CTEs, subqueries, set operations
- Window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD)
- Rolling calculations
- Debugging & query selection
- Cohort/retention/event-data problems
- Interview difficulty progression: Basic → Intermediate → Advanced → Screening

**Statistics/Causal Inference:**
- Estimands and confounding
- Causal vs. associational interpretation
- Marginal vs. conditional effects
- Mixed-model interpretation
- What specific R code actually estimates

**Machine Learning:**
- Model selection, bias/variance, validation, leakage
- Trees, random forests, boosting
- Neural networks and training behavior
- Interpreting Python/PyTorch code

**Quiz metadata (per question):**
```
- ID (unique)
- Topic / Subtopic
- Difficulty
- Question type
- Correct answer
- Explanation
- Related learning page
- Why distractors are wrong (where helpful)
```

**Answer handling:** Answers hidden by default, revealed on request.

**Coordination:** Work with Progress & UI Agent so quiz attempts feed into progress tracking.

---

### 5. `progress-ui.agent.md`

**Purpose:** Homepage, progress tracking, lightweight UI — keep it motivating without complexity.

**Homepage sections:**

1. **Continue learning** — Recently opened pages (3–5 items)
   - Approach: Browser/local storage for page visits
   - Automatically updated where practical
   - Fallback: manual if tracking too complex

2. **Current learning areas** — Cards for major topics
   - Icon, title, short description, progress indicator, link
   - Minimalistic visual design

3. **Quiz progress** — Compact table
   - Topic | Completed | Accuracy
   - Derived from locally stored quiz attempts (not fabricated)

4. **Suggested next activity**
   - One simple recommendation (unfinished quiz / weakest topic / logical next / reinforcement)
   - Transparent logic

5. **Recent activity** — Very brief history
   - Pages viewed, quizzes completed, new pages added
   - Not an activity feed with excessive detail

6. **Learning overview**
   - At-a-glance coverage (Statistics, SQL, ML, Python)
   - Subtle progress bars/dots/completion counts

**Progress tracking system:**
- **Client-side preferred** (browser local storage, no database/backend)
- Track: pages opened, latest pages viewed, quiz attempts, quiz score, topic-level progress, last activity
- Static Quarto site compatible
- No authentication/accounts

**Before implementation:**
1. Inspect existing project
2. Propose simplest storage approach
3. Explain what persists and what doesn't
4. Identify any major trade-offs requiring approval

**Dedicated progress page** (`track/progress.qmd` or similar):

- **Overall progress**: pages explored, quizzes completed, average score, topics started/completed
- **By topic**: Collapsible sections for SQL, Causal Inference, ML (with subtopic status)
- **Quiz history**: Date, difficulty, score, improvement from previous attempt
- **Areas to revisit**: Derived from quiz performance (keep logic simple and explainable)

**Motivational design:**
- ✅ Subtle progress bars, completion ticks, topic icons, small achievement indicators
- ✅ "Recently studied", "Suggested next", improvement tracking, completion %
- ❌ Excessive badges, confetti, cartoons, unnecessary animations, points/currencies, leaderboards

**Visual language:** Clean professional learning dashboard, not gamified.

**Icons and graphics:**
- Statistics: causal DAGs, conditional vs. population-average diagrams
- SQL: table/database icons, JOIN diagrams, window partition visualizations
- ML: decision-tree diagrams, neural-network schematics, training/validation curves
- Python: project structure trees, workflow diagrams

Keep diagrams simple, prefer reproducible generation (code) over embedded screenshots.

---

### 6. `notebook-tester.agent.md`

**Purpose:** Independently validate all notebook changes (builds, renders, code, examples, quizzes).

**Quarto validation:**
- Complete render (quarto render)
- Detect render failures
- Check for warnings
- Validate YAML frontmatter
- Check internal navigation
- Detect missing files
- Verify page links (where practical)

**Python examples:**
- Syntax verification
- Execute important examples where practical
- Use pytest for reusable tests
- Verify expected outputs

**R examples:**
- Parse verification
- Execute where practical
- Use testthat selectively
- Don't over-test trivial examples

**SQL examples (if practical):**
- Use DuckDB (lightweight, portable, embedded)
- Create deterministic fixture tables
- For interview questions: execute → compare expected output
- Critical for NULL, JOIN, aggregation, window functions, duplicate handling

**Quiz validation:**
- Each question has: ID, topic, difficulty, explanation, one correct answer
- No duplicate IDs
- Flag near-duplicates
- Multiple-choice answer identifiers valid

**Progress system tests:**
- Page visit updates recent-page list
- Duplicate visits don't corrupt history
- Quiz results stored correctly
- Repeated attempts handled
- Topic summaries calculate correctly
- Missing local storage fails gracefully
- Homepage renders without progress data
- Clearing browser storage doesn't break site

**Homepage/UI tests:**
- Cards render correctly
- Links valid
- Mobile/responsive layout usable
- Progress values not fabricated
- Icons consistent
- Pages readable without JavaScript (fallback)

**Proposed testing stack:**
```
tests/
├── quarto/          (render checks, link validation)
├── python/          (pytest)
├── r/               (testthat, if needed)
├── sql/             (DuckDB fixtures)
└── ui/              (lightweight JS/HTML tests, if needed)
```

**Don't create empty directories.** Keep stack minimal.

**Suggested CI enhancement** (GitHub Actions):
1. Quarto render (detect failures/warnings)
2. Python tests (pytest)
3. SQL tests (DuckDB)
4. R tests (if added)
5. Lightweight UI/progress checks

**Before implementing CI changes:** Show proposal first.

---

## Workflow & Handoff Pattern

```
Notebook Planner
    ↓
  [proposes content]
    ↓
[You review & approve]
    ↓
Page Builder
    ↓
  [creates page]
    ↓
Content Reviewer
    ↓
  [technical + pedagogical review]
    ↓
  [if issues → Page Builder fixes]
    ↓
Quiz Builder
    ↓
  [creates/validates quiz]
    ↓
Progress & UI Agent
    ↓
  [integrates with homepage/tracking]
    ↓
Notebook Tester
    ↓
  [full render + test suite]
    ↓
[Report: Changes | Review findings | Test results | Progress impact]
```

---

## Infrastructure Proposals

### A. Metadata Schema (Page Frontmatter)

**Current frontmatter (already in template):**
```yaml
title: "Page Title"
area: "Statistics"              # one of: Statistics, Machine Learning, etc.
status: "todo|in-progress|done"
confidence: 1                   # 1–5 (user's self-rating)
last-reviewed: "2026-09-09"     # YYYY-MM-DD
practice: false                 # has a related worked example/exercise
quiz: false                     # has a related quiz
```

**Recommended additions for future:**
```yaml
learning-objectives:  # optional, 3–5 bullets
  - "Understand..."
prerequisites:        # optional, list of related topic page files
  - "learn/statistics/probability-distributions-sampling.qmd"
difficulty: "beginner|intermediate|advanced"  # optional, for progression
related-topics:       # optional, other pages to link
  - "marginal-and-conditional-effects.qmd"
```

**Rationale:** Supports navigation, recommendations, quiz linking, progress tracking. Keep simple; don't over-engineer.

---

### B. Quiz Metadata & Persistence

**Per-question metadata (JSON structure, embedded in quiz page or separate file):**
```json
{
  "quiz_id": "sql-window-functions-01",
  "title": "SQL Window Functions",
  "topic": "SQL",
  "difficulty": "intermediate",
  "questions": [
    {
      "id": "sq-wf-001",
      "text": "Question here...",
      "type": "multiple-choice",
      "options": ["A", "B", "C", "D"],
      "correct": "A",
      "explanation": "...",
      "related_page": "learn/programming-computing/sql-window-functions.qmd"
    }
  ]
}
```

**Storage approach:**
- Quiz attempts stored in browser localStorage
- Structure: `{ quiz_id, date, score, difficulty, answers: [] }`
- Can be manually exported/backed up if needed
- Survives browser close, lost if cache is cleared
- Lightweight JS to parse, score, store results

**Fallback:** If localStorage proves problematic, revert to simple answer-reveal (no scoring tracking).

---

### C. Progress Tracking (Client-Side)

**Browser localStorage schema:**

```javascript
{
  "notebook_progress": {
    "pages_visited": [
      { "path": "learn/statistics/...", "title": "...", "date": "2026-09-09T..." }
      // Most recent 5–10 pages only
    ],
    "quiz_attempts": [
      { "quiz_id": "sql-wf-01", "score": 4, "total": 5, "date": "2026-09-09", "difficulty": "intermediate" }
    ],
    "last_active": "2026-09-09T..."
  }
}
```

**Update triggers:**
- Page visit: on page load, record in `pages_visited`
- Quiz completion: on finish, store attempt in `quiz_attempts`
- Computed on-the-fly: topic progress, average scores, areas to revisit

**Homepage JS logic (simple & transparent):**
1. Load localStorage
2. Display most recent pages
3. Group quiz attempts by topic, compute accuracy
4. Find lowest-scoring topic or unfinished quiz
5. Fallback: show placeholders if no data

**Considerations:**
- localStorage ~10MB per domain (plenty for this use case)
- No login/sync across devices (user accepts this limitation)
- Clearing cache loses data (acceptable for personal notebook)
- No backend = no privacy concerns

---

### D. Reusable Components

**Goal:** Avoid duplication across pages.

**Candidate components:**

1. **Quiz component** (HTML template + JS)
   - Renders multiple-choice question
   - Handles answer selection & marking
   - Shows/hides explanation
   - Records attempt in localStorage

2. **Progress cards** (CSS + HTML snippets)
   - Topic card with icon, title, description, progress indicator
   - Used on homepage and progress page

3. **Progress bar** (CSS/lightweight JS)
   - Visual completion indicator (0–100%)
   - Used across homepage, progress page, topic cards

4. **Topic icon library**
   - Map topic/area name → Bootstrap icon
   - Consistent styling across site

5. **Recent pages widget** (JS component)
   - Fetch from localStorage
   - Format and display as list/cards

6. **Quiz score summary** (JS component)
   - Pull quiz attempts, group by topic
   - Display compact table (Topic | Completed | Accuracy)

**Implementation approach:**
- Store reusable components in `templates/` (alongside topic-template.qmd)
- Use Quarto includes or HTML fragments
- Document usage in component README
- Keep code understandable for self-maintenance

---

### E. Testing Architecture

**Proposed structure:**
```
tests/
├── README.md                   (test running & conventions)
├── conftest.py                 (pytest fixtures, if needed)
├── quarto/
│   └── test_render.py          (quarto render, YAML parsing, link validation)
├── python/
│   └── test_*.py               (pytest for executable examples)
├── sql/
│   ├── fixtures.duckdb         (test data, auto-generated)
│   └── test_*.py               (DuckDB + pytest)
└── ui/                         (minimal JS tests, if implemented)
    └── test_progress.js        (localStorage, homepage rendering)
```

**What NOT to create:**
- Empty placeholder directories
- Tests for trivial code (e.g., a single code snippet with no dependencies)
- Over-engineered test fixtures

**CI workflow (proposed enhancement):**
```yaml
# .github/workflows/test.yml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Render Quarto
        run: quarto render && python tests/quarto/test_render.py
      - name: Python tests
        run: pytest tests/python/ -v
      - name: SQL tests
        run: pytest tests/sql/ -v
      - name: UI tests (if applicable)
        run: npm test tests/ui/ || echo "Skipping JS tests"
```

**Approval needed before implementing CI changes.**

---

## Identified Reusable Assets

1. **Custom SCSS theme** (colors, typography, layout already defined)
2. **Topic template** (structure, frontmatter, sections already proven)
3. **Page Tracker** (auto-listing via frontmatter, ready to extend)
4. **Bootstrap/Quarto icons** (no new dependency needed)
5. **GitHub Actions CI foundation** (publish.yml already in place)
6. **URL routing** (Quarto sidebar navigation mature)

---

## Major Decisions Requiring Approval

1. **Progress storage approach:** Browser localStorage vs. alternative
2. **Quiz scoring UI:** Interactive JS scoring vs. simple answer reveal
3. **Testing stack scope:** pytest + DuckDB vs. heavier tools
4. **CI enhancement:** Add test.yml workflow?
5. **Visual elements for progress/cards:** What Bootstrap icons/styles to use?
6. **Metadata schema expansion:** Add learning objectives, difficulty, prerequisites frontmatter now or later?

---

## Next Steps (Once Approved)

1. Create the six `.agent.md` files under `.github/agents/`
2. Design and implement reusable components (quiz, cards, progress widgets)
3. Build homepage redesign (if approved) with progress cards
4. Create dedicated progress page
5. Implement progress tracking (localStorage) and homepage JS logic
6. Set up minimal testing architecture (pytest for Quarto render, optionally DuckDB for SQL)
7. Test full workflow end-to-end

---

**Ready for your review and approval of architecture direction.**
