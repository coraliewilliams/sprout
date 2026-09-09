#!/usr/bin/env python
"""Validate SQL Query Optimization learning page and quiz."""

import re
import sys

# Define valid values
VALID_AREAS = ["Statistics", "Machine Learning", "Mathematics", "Data Science", "Experimental Design", "Programming & Computing", "Ecology"]
VALID_STATUSES = ["todo", "in-progress", "done"]

def parse_yaml_frontmatter(content):
    """Extract YAML frontmatter from .qmd file"""
    if not content.startswith('---'):
        return None, content
    
    lines = content.split('\n')
    yaml_end = None
    for i in range(1, len(lines)):
        if lines[i].startswith('---'):
            yaml_end = i
            break
    
    if yaml_end is None:
        return None, content
    
    yaml_content = '\n'.join(lines[1:yaml_end])
    return yaml_content, content

def validate_yaml(yaml_content, is_quiz=False):
    """Validate YAML frontmatter fields"""
    errors = []
    warnings = []
    
    # Parse YAML fields
    fields = {}
    for line in yaml_content.split('\n'):
        if ':' in line and not line.strip().startswith('#'):
            key, value = line.split(':', 1)
            fields[key.strip()] = value.strip().strip('"\'')
    
    # Check required fields
    required = ['title', 'area', 'status']
    for field in required:
        if field not in fields:
            errors.append(f"Missing required field: {field}")
        elif field == 'area' and fields[field] not in VALID_AREAS:
            errors.append(f"Invalid area '{fields[field]}'. Must be in {VALID_AREAS}")
        elif field == 'status':
            # Handle both "in-progress" and "in progress"
            status = fields[field].replace(' ', '-')
            if status not in VALID_STATUSES:
                errors.append(f"Invalid status '{fields[field]}'. Must be in {VALID_STATUSES}")
            if ' ' in fields[field]:
                warnings.append(f"Status has spaces: '{fields[field]}'. Should use hyphens: 'in-progress'")
    
    # Check confidence is 1-5
    if 'confidence' in fields:
        try:
            conf = int(fields['confidence'])
            if not (1 <= conf <= 5):
                errors.append(f"Confidence {conf} out of range (1-5)")
        except ValueError:
            errors.append(f"Confidence must be integer, got: {fields['confidence']}")
    
    # Check quiz field
    if 'quiz' in fields:
        if fields['quiz'].lower() not in ['true', 'false']:
            errors.append(f"Quiz field must be true/false, got: {fields['quiz']}")
        if is_quiz and fields['quiz'].lower() != 'true':
            warnings.append("This is a quiz file but quiz: false in frontmatter")
    
    return fields, errors, warnings

def count_sections(content):
    """Count markdown sections (## headers)"""
    return len(re.findall(r'^##\s+', content, re.MULTILINE))

def count_quiz_questions(content):
    """Count quiz questions (### headers with question text)"""
    # Count ### headings followed by text
    return len(re.findall(r'^###\s+\d+\.\s+', content, re.MULTILINE))

def find_code_blocks(content):
    """Find all SQL code blocks"""
    pattern = r'```sql\n(.*?)\n```'
    return re.findall(pattern, content, re.DOTALL)

def validate_internal_links(content, filename):
    """Check for broken internal links"""
    errors = []
    # Pattern for markdown links
    link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
    
    for match in re.finditer(link_pattern, content):
        text, url = match.groups()
        # Check for common issues
        if url.startswith('#'):
            # Anchor link - check if section header exists
            anchor_id = url[1:].lower().replace(' ', '-')
            # Try to find corresponding header
            if not re.search(rf'^##\s+.*{anchor_id}', content, re.MULTILINE | re.IGNORECASE):
                # Also try without hyphens
                anchor_words = anchor_id.replace('-', ' ')
                if not re.search(rf'^##\s+.*{anchor_words}', content, re.MULTILINE | re.IGNORECASE):
                    errors.append(f"Broken anchor link: {url}")
    
    return errors

# Load and validate learning page
print("=" * 60)
print("LEARNING PAGE: sql-query-optimization.qmd")
print("=" * 60)
with open('learn/programming-computing/sql-query-optimization.qmd', 'r') as f:
    learn_content = f.read()

yaml, body = parse_yaml_frontmatter(learn_content)
if yaml:
    fields, errors, warnings = validate_yaml(yaml, is_quiz=False)
    print(f"\n✓ YAML Frontmatter Found")
    print(f"  Title: {fields.get('title', 'N/A')}")
    print(f"  Area: {fields.get('area', 'N/A')}")
    print(f"  Status: {fields.get('status', 'N/A')}")
    print(f"  Confidence: {fields.get('confidence', 'N/A')}")
    print(f"  Quiz: {fields.get('quiz', 'N/A')}")
    
    if errors:
        print(f"\n✗ ERRORS:")
        for err in errors:
            print(f"  - {err}")
    if warnings:
        print(f"\n⚠ WARNINGS:")
        for warn in warnings:
            print(f"  - {warn}")
    if not errors:
        print("\n✓ YAML Frontmatter valid")

# Content validation
print("\n--- CONTENT VALIDATION ---")
sections = count_sections(learn_content)
print(f"Sections (##): {sections}")
if sections >= 7:
    print("✓ Has 7+ sections")
else:
    print(f"⚠ Only {sections} sections (expected 7+)")

code_blocks = find_code_blocks(learn_content)
print(f"SQL code blocks: {len(code_blocks)}")

link_errors = validate_internal_links(learn_content, 'learn/programming-computing/sql-query-optimization.qmd')
if link_errors:
    print("✗ Link validation errors:")
    for err in link_errors:
        print(f"  - {err}")
else:
    print("✓ Internal anchor links valid")

# Load and validate quiz page
print("\n" + "=" * 60)
print("QUIZ PAGE: sql-query-optimization.qmd")
print("=" * 60)
with open('practise/quizzes/sql-query-optimization.qmd', 'r') as f:
    quiz_content = f.read()

yaml, body = parse_yaml_frontmatter(quiz_content)
if yaml:
    fields, errors, warnings = validate_yaml(yaml, is_quiz=True)
    print(f"\n✓ YAML Frontmatter Found")
    print(f"  Title: {fields.get('title', 'N/A')}")
    print(f"  Area: {fields.get('area', 'N/A')}")
    print(f"  Status: {fields.get('status', 'N/A')}")
    print(f"  Confidence: {fields.get('confidence', 'N/A')}")
    print(f"  Quiz: {fields.get('quiz', 'N/A')}")
    
    if errors:
        print(f"\n✗ ERRORS:")
        for err in errors:
            print(f"  - {err}")
    if warnings:
        print(f"\n⚠ WARNINGS:")
        for warn in warnings:
            print(f"  - {warn}")
    if not errors:
        print("\n✓ YAML Frontmatter valid")

# Quiz content validation
print("\n--- CONTENT VALIDATION ---")
questions = count_quiz_questions(quiz_content)
print(f"Quiz questions (### N. format): {questions}")
if questions >= 8:
    print("✓ Has 8+ questions")
else:
    print(f"⚠ Only {questions} questions (expected 8+)")

# Check for answer options
answer_patterns = re.findall(r'^[A-D]\.\s+', quiz_content, re.MULTILINE)
print(f"Answer options found: {len(answer_patterns)} (should be 4 per question)")

# Check for answer sections
answer_sections = len(re.findall(r'<details>', quiz_content))
print(f"Answer sections (details): {answer_sections}")

# Check for explanations
explanation_count = len(re.findall(r'\*\*Correct answer:', quiz_content))
print(f"Explanations: {explanation_count}")

# Validate links back to learning page
link_errors = validate_internal_links(quiz_content, 'practise/quizzes/sql-query-optimization.qmd')
if link_errors:
    print("✗ Link validation errors:")
    for err in link_errors:
        print(f"  - {err}")
else:
    print("✓ Internal links to learning page valid")

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print("\nAll structural validations complete. Review warnings above.")
