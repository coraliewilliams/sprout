"""
SQL Tests — Joins and NULL Behavior

Tests for SQL query correctness, especially JOIN types and NULL handling.
"""

import pytest
import duckdb
from fixtures import FIXTURES_SQL

@pytest.fixture
def conn():
    """Create in-memory DuckDB connection with test data"""
    connection = duckdb.connect(":memory:")
    connection.execute(FIXTURES_SQL)
    return connection

class TestJoins:
    """Test INNER JOIN, LEFT JOIN, and other join types"""
    
    def test_inner_join_matching_rows_only(self, conn):
        """INNER JOIN returns only matching rows"""
        result = conn.execute("""
            SELECT o.order_id, c.name
            FROM orders o
            INNER JOIN customers c ON o.customer_id = c.customer_id
            ORDER BY o.order_id
        """).fetchall()
        
        # Orders 1-5 have matching customers; order 6 (NULL customer_id) is excluded
        assert len(result) == 5
        assert result[0] == (1, 'Alice')
        assert result[2] == (3, 'Bob')
    
    def test_inner_join_excludes_null(self, conn):
        """INNER JOIN excludes NULL keys"""
        result = conn.execute("""
            SELECT COUNT(*) FROM orders
        """).fetchone()
        total_orders = result[0]
        
        result = conn.execute("""
            SELECT COUNT(*) FROM orders o
            INNER JOIN customers c ON o.customer_id = c.customer_id
        """).fetchone()
        joined_count = result[0]
        
        # One order (order_id=6) has NULL customer_id and is excluded
        assert joined_count == total_orders - 1
    
    def test_left_join_includes_unmatched(self, conn):
        """LEFT JOIN includes unmatched rows from left table"""
        result = conn.execute("""
            SELECT c.customer_id, c.name, COUNT(o.order_id) as order_count
            FROM customers c
            LEFT JOIN orders o ON c.customer_id = o.customer_id
            GROUP BY c.customer_id, c.name
            ORDER BY c.customer_id
        """).fetchall()
        
        # Customer 103 (Charlie) has no orders but appears in result
        assert len(result) == 3
        
        # Find Charlie's row
        charlie = [r for r in result if r[1] == 'Charlie'][0]
        assert charlie == (103, 'Charlie', 0)  # 0 orders
    
    def test_left_join_with_null_keys(self, conn):
        """LEFT JOIN with NULL keys from left table"""
        result = conn.execute("""
            SELECT o.order_id, o.customer_id, c.name
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.customer_id
            WHERE o.customer_id IS NULL
        """).fetchall()
        
        # Order 6 has NULL customer_id
        assert len(result) == 1
        assert result[0] == (6, None, None)

class TestNullBehavior:
    """Test SQL NULL handling"""
    
    def test_null_comparison(self, conn):
        """NULL comparisons return NULL (not true or false)"""
        result = conn.execute("""
            SELECT COUNT(*) FROM orders WHERE customer_id = NULL
        """).fetchone()
        
        # No rows matched (NULL = NULL is NULL, not true)
        assert result[0] == 0
    
    def test_null_is_operator(self, conn):
        """IS NULL correctly identifies NULL"""
        result = conn.execute("""
            SELECT COUNT(*) FROM orders WHERE customer_id IS NULL
        """).fetchone()
        
        # Order 6 has NULL customer_id
        assert result[0] == 1
    
    def test_null_in_aggregation(self, conn):
        """NULL values are excluded from SUM/AVG/COUNT(col)"""
        result = conn.execute("""
            SELECT SUM(amount) FROM orders WHERE customer_id IS NOT NULL
        """).fetchone()
        sum_no_null = result[0]
        
        result = conn.execute("""
            SELECT SUM(amount) FROM orders
        """).fetchone()
        sum_all = result[0]
        
        # sum_all should be less if NULL customer_id order is included
        # Actually, SUM excludes NULL but sums the amount anyway
        # Let me test COUNT instead
        
        result = conn.execute("""
            SELECT COUNT(*), COUNT(customer_id) FROM orders
        """).fetchall()[0]
        
        total_rows, non_null_count = result
        assert total_rows == 6  # All rows
        assert non_null_count == 5  # One NULL excluded from COUNT(customer_id)

class TestGroupBy:
    """Test GROUP BY and HAVING"""
    
    def test_group_by_with_null(self, conn):
        """GROUP BY includes NULL as a group"""
        result = conn.execute("""
            SELECT customer_id, COUNT(*) as order_count
            FROM orders
            GROUP BY customer_id
            ORDER BY customer_id
        """).fetchall()
        
        # NULL should be its own group
        assert len(result) == 4
        
        # Last row should be NULL customer with count 1
        assert result[-1] == (None, 1)
    
    def test_having_clause(self, conn):
        """HAVING filters grouped results"""
        result = conn.execute("""
            SELECT customer_id, COUNT(*) as order_count
            FROM orders
            GROUP BY customer_id
            HAVING COUNT(*) > 1
            ORDER BY customer_id
        """).fetchall()
        
        # Only customers 100 and 101 have > 1 order
        assert len(result) == 2
        assert result[0] == (100, 2)
        assert result[1] == (101, 2)

class TestWindowFunctions:
    """Test window functions: ROW_NUMBER, RANK, LAG, etc."""
    
    def test_row_number_partition(self, conn):
        """ROW_NUMBER assigns unique numbers within partition"""
        result = conn.execute("""
            SELECT 
              customer_id, 
              order_id,
              amount,
              ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) as rn
            FROM orders
            WHERE customer_id IS NOT NULL
            ORDER BY customer_id, rn
        """).fetchall()
        
        # Customer 100's orders should have rn=1,2
        customer_100 = [r for r in result if r[0] == 100]
        assert len(customer_100) == 2
        assert customer_100[0][3] == 1
        assert customer_100[1][3] == 2
    
    def test_rank_with_ties(self, conn):
        """RANK handles ties (same rank repeated, next rank skips)"""
        # Create a scenario with ties
        result = conn.execute("""
            CREATE TEMP TABLE scores (customer_id INT, score INT);
            INSERT INTO scores VALUES (1, 100), (2, 100), (3, 90), (4, 90), (5, 80);
            
            SELECT 
              customer_id,
              score,
              RANK() OVER (ORDER BY score DESC) as rank
            FROM scores
            ORDER BY rank, customer_id
        """).fetchall()
        
        # Customers 1,2 both have rank 1; customers 3,4 have rank 3 (skips 2)
        assert result[0][2] == 1  # Customer 1
        assert result[1][2] == 1  # Customer 2
        assert result[2][2] == 3  # Customer 3 (rank skips from 1 to 3)
    
    def test_lag_function(self, conn):
        """LAG retrieves previous row's value"""
        result = conn.execute("""
            SELECT 
              order_id,
              customer_id,
              amount,
              LAG(amount) OVER (PARTITION BY customer_id ORDER BY order_date) as prev_amount
            FROM orders
            WHERE customer_id = 100
            ORDER BY order_date
        """).fetchall()
        
        # First order should have NULL previous amount
        assert result[0][3] is None
        
        # Second order should have first order's amount
        assert result[1][3] == 50.00

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
