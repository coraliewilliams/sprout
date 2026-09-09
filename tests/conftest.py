"""
conftest.py for pytest

Shared fixtures and configuration for all tests.
"""

import pytest

def pytest_configure(config):
    """Configure pytest"""
    config.addinivalue_line(
        "markers", "quarto: marks tests as quarto rendering tests"
    )
    config.addinivalue_line(
        "markers", "python: marks tests as python example tests"
    )
    config.addinivalue_line(
        "markers", "sql: marks tests as SQL tests"
    )
