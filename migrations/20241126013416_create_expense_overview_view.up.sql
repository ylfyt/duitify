CREATE OR REPLACE VIEW "user_schema".expense_overview AS
WITH expenses AS (
    SELECT
        SUM(amount) AS amount,
        COUNT(category_id) as count,
        category_id
    FROM
        "user_schema".TRANSACTION
    WHERE
        TYPE = 'expense'
    GROUP BY
        category_id 
)
SELECT
	e.*,
	c.name,
	c.logo
FROM
	expenses e
JOIN "user_schema".category c ON
	e.category_id = c.id
ORDER BY
	e.amount DESC;