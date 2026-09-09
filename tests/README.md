# Testing the Notebook

This directory contains tests to validate the notebook's Quarto rendering, code examples, quizzes, and progress tracking system.

## Quick Start

### Prerequisites
```bash
pip install pytest duckdb
```

### Run All Tests
```bash
pytest tests/ -v
```

### Run Specific Category
```bash
pytest tests/quarto/ -v      # Quarto rendering & structure
pytest tests/python/ -v      # Python code examples
pytest tests/sql/ -v         # SQL queries
pytest tests/ui/ -v          # Progress & homepage (if JS tests added)
```

---

## Test Categories

### Quarto (`tests/quarto/`)
- Full Quarto render check
- YAML frontmatter validation (all topic pages)
- Navigation link validation
- Missing file detection

**Run:** `python tests/quarto/test_render.py`

### Python (`tests/python/`)
- Syntax verification for code examples
- Optional: Execution tests for important ML/data examples

**Run:** `pytest tests/python/ -v`

### SQL (`tests/sql/`)
- DuckDB fixture setup
- Query output validation
- NULL, JOIN, GROUP BY, window function correctness
- Edge cases (duplicates, aggregation, ranking)

**Run:** `pytest tests/sql/ -v`

### UI/Progress (`tests/ui/`)
- localStorage behavior (if tested)
- Homepage rendering without errors
- Progress calculations correctness
- Mobile/responsive layout checks

**Run:** `pytest tests/ui/ -v` (or JS runner if set up)

---

## Writing Tests

### Python Example
```python
# tests/python/test_example.py
import pytest

def test_numpy_array_shape():
    """Verify numpy array example from learn/programming-computing/python-numpy.qmd"""
    import numpy as np
    arr = np.array([1, 2, 3])
    assert arr.shape == (3,)
```

### SQL Example
```python
# tests/sql/test_joins.py
import duckdb
import pytest

@pytest.fixture
def conn():
    """Create in-memory DuckDB connection with test data"""
    connection = duckdb.connect(":memory:")
    # Load fixtures
    connection.execute(open("tests/sql/fixtures.sql").read())
    return connection

def test_inner_join(conn):
    """Verify INNER JOIN behavior from SQL learning page"""
    result = conn.execute("""
        SELECT t1.id FROM t1 INNER JOIN t2 ON t1.id = t2.id
    """).fetchall()
    assert len(result) == 1  # Only matching rows
```

---

## CI/CD Integration

A proposed GitHub Actions workflow is available in:
`PROPOSED_CI.yml` (requires your approval before implementation)

To implement:
1. Review and approve the workflow
2. Move to `.github/workflows/test.yml`
3. Commit and push

---

## Troubleshooting

### "No such file or directory: tests/quarto/test_render.py"
Ensure you're running from the repository root: `cd /path/to/my-notebook && pytest tests/`

### ImportError: No module named 'duckdb'
Install: `pip install duckdb`

### SQL tests fail with fixture not found
Ensure `tests/sql/fixtures.sql` exists and is valid SQL.

---

## Best Practices

- **Keep tests focused:** One concept per test
- **Use fixtures:** Shared setup (like DuckDB connections)
- **Skip trivial tests:** Don't test simple single-line code snippets
- **Document intention:** Use descriptive test names and docstrings
- **Test edge cases:** NULL, empty results, duplicates, bounds
