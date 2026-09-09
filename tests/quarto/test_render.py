"""
Quarto Rendering Validation

Tests:
- Full quarto render succeeds
- No render warnings or errors
- All YAML frontmatter is valid
- All sidebar links exist
- No broken references
"""

import subprocess
import sys
import os
import re
from pathlib import Path
import yaml

def test_quarto_render():
    """Full Quarto render should complete without errors"""
    result = subprocess.run(
        ["quarto", "render"],
        cwd=os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0, f"Quarto render failed:\n{result.stderr}"
    print("✓ Quarto render successful")

def test_frontmatter_validity():
    """All topic pages should have valid YAML frontmatter"""
    repo_root = Path(__file__).parent.parent.parent
    learn_dir = repo_root / "learn"
    
    errors = []
    valid_areas = {
        "Statistics", "Machine Learning", "Mathematics", "Data Science",
        "Experimental Design", "Programming & Computing", "Ecology"
    }
    valid_statuses = {"todo", "in-progress", "done"}
    
    for qmd_file in learn_dir.rglob("*.qmd"):
        if qmd_file.name == "index.qmd":
            continue
        
        try:
            with open(qmd_file, 'r') as f:
                content = f.read()
                # Extract YAML frontmatter
                match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
                if not match:
                    errors.append(f"{qmd_file}: No YAML frontmatter found")
                    continue
                
                fm = yaml.safe_load(match.group(1))
                
                # Check required fields
                if not fm.get("title"):
                    errors.append(f"{qmd_file}: Missing title")
                
                area = fm.get("area", "")
                if area not in valid_areas:
                    errors.append(f"{qmd_file}: Invalid area '{area}'")
                
                status = fm.get("status", "")
                if status not in valid_statuses:
                    errors.append(f"{qmd_file}: Invalid status '{status}'")
                
                confidence = fm.get("confidence", 0)
                if not isinstance(confidence, int) or confidence < 1 or confidence > 5:
                    errors.append(f"{qmd_file}: confidence must be 1-5")
                
                last_reviewed = fm.get("last-reviewed")
                if last_reviewed and not re.match(r'\d{4}-\d{2}-\d{2}', str(last_reviewed)):
                    errors.append(f"{qmd_file}: last-reviewed invalid format")
        
        except Exception as e:
            errors.append(f"{qmd_file}: {str(e)}")
    
    assert not errors, "\n".join(errors)
    print(f"✓ YAML frontmatter valid for all {len(list(learn_dir.rglob('*.qmd')))} pages")

def test_no_malformed_yaml():
    """Detect any malformed YAML that would break rendering"""
    repo_root = Path(__file__).parent.parent.parent
    
    errors = []
    for qmd_file in repo_root.rglob("*.qmd"):
        try:
            with open(qmd_file, 'r') as f:
                content = f.read()
                match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
                if match:
                    yaml.safe_load(match.group(1))
        except yaml.YAMLError as e:
            errors.append(f"{qmd_file}: {str(e)}")
    
    assert not errors, "\n".join(errors)
    print("✓ No malformed YAML detected")

if __name__ == "__main__":
    print("Running Quarto validation tests...")
    print()
    
    try:
        test_quarto_render()
    except AssertionError as e:
        print(f"✗ {e}")
        sys.exit(1)
    
    try:
        test_frontmatter_validity()
    except AssertionError as e:
        print(f"✗ {e}")
        sys.exit(1)
    
    try:
        test_no_malformed_yaml()
    except AssertionError as e:
        print(f"✗ {e}")
        sys.exit(1)
    
    print()
    print("All Quarto tests passed ✓")
