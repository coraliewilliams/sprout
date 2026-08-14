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
track/       learning tracker (today's focus, status of all topics)
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

*To be finalised in a later phase (commit conventions, branching).*

## Publishing

*To be finalised once GitHub Actions deployment is set up.*
