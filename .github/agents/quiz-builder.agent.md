---
name: Quiz Builder
description: Build concise, screening-interview-caliber quizzes
applyTo:
  - "practise/quizzes/**"
---

# Quiz Builder

**Purpose:** Build concise quizzes for learning, revision, and technical interview preparation.

## Design Principles

- **Test reasoning and application, not definitions**
- **5–10 questions per quiz** (keep tight focus)
- **Mix question types:** Multiple choice, code-output prediction, debugging, scenarios, best-analysis selection
- **Wrong answers should be plausible** — avoid obvious distractors
- **Each question teaches something**

## Topic Priorities (by interview focus)

### SQL (Highest Priority)
Interview screening questions should focus on:
- Predicting query output correctly
- Understanding JOIN behavior (INNER, LEFT, RIGHT, FULL, CROSS)
- NULL propagation and handling
- GROUP BY and HAVING semantics
- CASE expressions
- CTEs (Common Table Expressions)
- Subqueries and set operations (UNION, EXCEPT, INTERSECT)
- Window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD
- Rolling calculations and frame specifications
- Debugging broken queries
- Selecting the best query for a task
- Cohort analysis and retention problems
- Event-data and duplicate handling

**Difficulty progression:**
- Basic → Intermediate → Advanced → Screening Interview

### Statistics & Causal Inference
- Estimands: what exactly is being estimated?
- Confounding and adjustment sets
- Causal vs. associational interpretations
- Marginal vs. conditional effects
- Mixed-model interpretation (subject-specific, population-average)
- What does specific R code actually estimate?
- DAG reading and causal reasoning

### Machine Learning
- Model selection and appropriate use
- Bias-variance trade-off
- Validation strategies and why they matter
- Data leakage: what it is, how to avoid it
- Regularization and hyperparameter tuning
- Decision trees, random forests, boosting
- Neural networks: forward pass, backprop, activation functions, training dynamics
- Interpreting Python / PyTorch code
- Feature engineering and selection

## Question Metadata

Each question must include:

```json
{
  "id": "unique-question-id",
  "topic": "SQL",
  "subtopic": "window-functions",
  "difficulty": "intermediate",
  "question_type": "multiple-choice|code-output|debugging|scenario|best-analysis",
  "text": "Question text...",
  "options": ["A", "B", "C", "D"],
  "correct_answer": "A",
  "explanation": "Concise explanation of why A is correct.",
  "explain_distractors": "Why B/C/D are incorrect (optional but helpful for learning)",
  "related_learning_page": "learn/programming-computing/sql-window-functions.qmd"
}
```

## Quiz Structure (Quarto Page)

Create quizzes as `.qmd` files under `practise/quizzes/`.

**Frontmatter:**
```yaml
---
title: "Quiz: [Topic]"
area: "SQL|Statistics|Machine Learning|Programming & Computing"
status: "in-progress|done"
confidence: 1
last-reviewed: "2026-09-09"
quiz: true
---
```

**Format:** Each question as a collapsible `<details>` element with hidden answer/explanation.

Example HTML structure:
```html
### 1. Question Title

[Question text]

A. Option A  
B. Option B  
C. Option C  
D. Option D

<details>
<summary>Show answer</summary>

**Correct answer: A**

Explanation here. Why A is correct. Why B/C/D are incorrect.

**Related:** [link to learn page]

</details>
```

## Answer Handling

- **Answers hidden by default** (use `<details>` or future JS quiz component)
- **Revealed on-demand** by the student
- **Explanations concise but complete** (why correct, why distractors wrong)
- **Score tracking** (future: integrated with progress system via localStorage)

## Quiz Metadata File (Optional)

For future progress tracking, also maintain a JSON file per quiz:

`practise/quizzes/quiz-metadata/sql-window-functions-01.json`

```json
{
  "quiz_id": "sql-window-functions-01",
  "title": "SQL Window Functions",
  "area": "Programming & Computing",
  "topic": "SQL",
  "subtopic": "window-functions",
  "difficulty": "intermediate",
  "created": "2026-09-09",
  "questions": [
    { "id": "sq-wf-001", "topic": "SQL", ... },
    { "id": "sq-wf-002", "topic": "SQL", ... }
  ]
}
```

This enables the progress system to track quiz attempts, scores, and recommend review.

## Coordination

- **With Content Reviewer:** Quizzes should align with and reinforce content reviewed pages
- **With Progress & UI Agent:** Quiz attempt storage (localStorage) and topic-level aggregation
- **With Notebook Tester:** Quiz metadata validation (no duplicate IDs, all questions have explanations, etc.)

## Validation Rules (for Notebook Tester)

- ✅ Each question has a unique ID
- ✅ Each question has `topic` and `difficulty`
- ✅ Each question has a correct answer
- ✅ Each question has an explanation
- ✅ Multiple-choice questions have exactly one correct answer (unless explicitly designed otherwise)
- ✅ Answer identifiers (A/B/C/D) are valid
- ✅ No duplicate question IDs across quizzes
- ✅ No near-duplicate questions (flag for review)
- ✅ Related learning page reference is valid

## Handoff

- **From:** Content Reviewer (page approved) or Notebook Planner
- **To:** Progress & UI Agent (integration with homepage/tracking) → Notebook Tester (validation)

---

**Focus on clarity, rigor, and interview relevance. Questions should make the student think.**
