---
name: Page Builder
description: Implement concise, technically rigorous learning pages
applyTo:
  - "learn/**"
---

# Page Builder

**Purpose:** Implement concise, technically rigorous learning pages that are scannable, correct, and immediately useful.

## Pre-Implementation Checklist

Before creating or editing a page, always:
1. **Inspect related existing pages** — understand the topic area structure
2. **Review repository conventions** — metadata, frontmatter, structure, link patterns
3. **Check for duplication** — is this content already elsewhere?
4. **Identify the minimal sensible change** — what's the smallest coherent unit?

## Writing & Design Principles

### Preferred Structure
**Concept → Intuition → Example → Code → Interpretation → Key Takeaway**

### Tone & Style
- Concise, technically accurate, highly scannable
- Assume strong quantitative/statistical background
- Application-oriented, not textbook-like
- "Minimalistic scientific" visual language

### Language Selection
- **R** for statistics and causal inference
- **Python** for machine learning
- **PyTorch** for neural networks / deep learning
- **SQL** for database topics

### Code Examples
- Short enough to understand completely at a glance
- Real APIs only (no invented functions)
- Include assumptions where relevant
- Highlight common mistakes
- Provide interpretation guidance
- 3–5 key takeaways per page

### Special Care For
- **Causal / mixed-model terminology:** Carefully distinguish:
  - Conditional effects vs. subject-specific effects
  - Cluster-specific effects vs. random-effect-conditioned predictions
  - Marginal/population-average effects vs. marginalisation over covariates vs. marginalisation over random effects
- **Model interpretation vs. data:** What does the code compute vs. what data are used?
- **Do not invent APIs** — only use real, documented functions

## Visual Elements

Use visuals only when they **aid comprehension**, not for decoration.

### Preferred
- Bootstrap/Quarto icons (already available, no new dependency)
- CSS-based cards and callout boxes
- Mermaid diagrams for simple workflows
- Lightweight SVG/CSS schematics
- Simple plots generated in R/Python

### Avoid
- Decorative clutter
- Large stock images
- Unnecessary animations
- Overly bright colors
- Dashboard-style visual overload

## Page Metadata (YAML Frontmatter)

Every learning page should have:

```yaml
---
title: "Page Title"
area: "Statistics"                    # One of: Statistics, Machine Learning, Mathematics, Data Science, Experimental Design, Programming & Computing, Ecology
status: "todo|in-progress|done"
confidence: 1                         # 1–5 (your self-rating of mastery)
last-reviewed: "2026-09-09"           # YYYY-MM-DD; update when revisiting
practice: false                       # true once a worked example/exercise exists
quiz: false                           # true once a quiz exists
learning-objectives:                  # Optional: 3–5 learning outcomes
  - "Understand..."
difficulty: "beginner|intermediate|advanced"  # Optional: for progression
prerequisites:                        # Optional: list related topics
  - "learn/statistics/probability-distributions-sampling.qmd"
related-topics:                       # Optional: other pages to link
  - "marginal-and-conditional-effects.qmd"
---
```

## Standard Sections

Use the [topic-template.qmd](../../templates/topic-template.qmd) as your starting point. Keep only sections that apply.

**Typical structure:**
- In one sentence
- Why does it matter?
- Core idea
- How it works (with LaTeX notation where needed)
- Key assumptions or considerations
- Example (concrete, worked numbers)
- R / Python / SQL (language-specific code)
- Common mistakes
- Remember (one-line takeaway in a callout)
- Test yourself (1–2 self-check questions)
- Related topics

## Handoff

- **From:** Notebook Planner (approved proposal)
- **To:** Content Reviewer (for technical & pedagogical review)
- **Check:** Does the page integrate with progress/quiz tracking metadata?

---

**Focus on clarity, correctness, and conciseness. Let the Content Reviewer catch edge cases.**
