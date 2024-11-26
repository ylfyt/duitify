CREATE OR REPLACE VIEW "public".expense_overview AS
WITH expenses AS (
    SELECT
        SUM(amount) AS amount,
        COUNT(category_id) as count,
        category_id
    FROM
        "public".TRANSACTION
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
JOIN "public".category c ON
	e.category_id = c.id
ORDER BY
	e.amount DESC;