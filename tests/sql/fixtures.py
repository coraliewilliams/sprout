"""
SQL Test Fixtures

Deterministic test data for SQL example validation.
"""

FIXTURES_SQL = """
-- ============================================================================
-- Test Tables for SQL Examples
-- ============================================================================

-- Sample orders table
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    amount DECIMAL(10, 2),
    order_date DATE
);

INSERT INTO orders VALUES
  (1, 100, 50.00, '2026-01-01'),
  (2, 100, 75.00, '2026-01-05'),
  (3, 101, 200.00, '2026-01-02'),
  (4, 101, 150.00, '2026-01-10'),
  (5, 102, 30.00, '2026-01-03'),
  (6, NULL, 100.00, '2026-01-04');  -- NULL customer_id for testing JOIN behavior

-- Sample customers table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR,
    country VARCHAR
);

INSERT INTO customers VALUES
  (100, 'Alice', 'USA'),
  (101, 'Bob', 'UK'),
  (103, 'Charlie', 'Canada');  -- customer_id 103 has no orders (for LEFT JOIN testing)

-- Sample events table (for window functions and analytics)
CREATE TABLE events (
    event_id INT PRIMARY KEY,
    customer_id INT,
    event_type VARCHAR,
    event_date DATE,
    value DECIMAL(10, 2)
);

INSERT INTO events VALUES
  (1, 100, 'purchase', '2026-01-01', 50.00),
  (2, 100, 'purchase', '2026-01-05', 75.00),
  (3, 100, 'return', '2026-01-06', -20.00),
  (4, 101, 'purchase', '2026-01-02', 200.00),
  (5, 101, 'purchase', '2026-01-10', 150.00),
  (6, 102, 'purchase', '2026-01-03', 30.00),
  (7, 102, 'support', '2026-01-04', 0.00);

-- Sample products table
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR,
    category VARCHAR,
    price DECIMAL(10, 2)
);

INSERT INTO products VALUES
  (1, 'Laptop', 'Electronics', 999.99),
  (2, 'Mouse', 'Electronics', 25.00),
  (3, 'Desk', 'Furniture', 299.99),
  (4, 'Chair', 'Furniture', 199.99),
  (5, 'Monitor', 'Electronics', 299.99);

-- Sample order_items table (for JOIN testing)
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10, 2),
    PRIMARY KEY (order_id, product_id)
);

INSERT INTO order_items VALUES
  (1, 1, 1, 999.99),
  (1, 2, 2, 25.00),
  (2, 3, 1, 299.99),
  (3, 4, 1, 199.99),
  (4, 5, 2, 299.99),
  (5, 2, 5, 25.00),
  (6, 1, 1, 999.99);
"""

# To use in tests:
# import pytest
# from fixtures import FIXTURES_SQL
# 
# @pytest.fixture
# def conn():
#     import duckdb
#     connection = duckdb.connect(":memory:")
#     connection.execute(FIXTURES_SQL)
#     return connection
