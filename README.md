# My notebook

A personal technical learning notebook covering statistics, machine learning,
mathematics, data science, experimental design, and programming. Built with
[Quarto](https://quarto.org) and published with GitHub Pages.

## Site structure

```
learn/       theory, reference notes, worked concepts (Statistics, Machine
             Learning, Mathematics, Data Science, Experimental Design,
             Programming & Computing)
practise/    worked examples, coding exercises, quizzes
track/       page tracker (build status of all topics) and learning tracker
             (today's focus, review due)
templates/   standard topic-page template
styles/      custom SCSS theme
```

## Requirements

- [Quarto](https://quarto.org/docs/get-started/) (1.5+)
- Git

## Local preview

```
quarto preview
```

## Render

```
quarto render
```

Output is written to `_site/` (not committed).

## Adding a new learning topic

1. Copy `templates/topic-template.qmd` into the relevant `learn/<subject>/` folder.
2. Fill in the frontmatter (`title`, `area`, `status`, `confidence`, `last-reviewed`).
3. Write the notes, then update `status`/`confidence` as understanding improves.
4. Add the new page to `_quarto.yml` under the relevant sidebar section.

## Git workflow

- Single `main` branch — no feature branches, this is a personal single-author notebook.
- Commit directly to `main` after each meaningful, working change (small, frequent commits rather than large batches).
- Commit messages are short, imperative, and describe what changed (e.g. "Add Mean and Variance topic page").
- `_site/` and `.quarto/` are never committed (see `.gitignore`); `_freeze/` **is** committed once it exists, so GitHub Actions can publish without re-executing code.
- Push to the remote only once changes have been previewed locally with `quarto render` or `quarto preview`.

## Publishing

Pushing to `main` triggers `.github/workflows/publish.yml`, which renders the
site with Quarto and deploys `_site/` to GitHub Pages via GitHub Actions.
Requires the repo's Pages source (Settings > Pages) to be set to
"GitHub Actions".
