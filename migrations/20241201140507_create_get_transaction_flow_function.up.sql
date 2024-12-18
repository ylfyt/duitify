CREATE OR REPLACE FUNCTION get_transaction_flow(
    trx_user_id UUID,
    trx_type transaction_type[],
    month_end_date INT,
    day_flow BOOLEAN,
    categories UUID[],
    time_zone VARCHAR,
    start_str VARCHAR,
    end_str VARCHAR
)
RETURNS TABLE(amount NUMERIC, occurred_at TEXT) 
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    WITH trx AS (
        SELECT 
            t.amount,
            t.type,
            t.occurred_at AT TIME ZONE time_zone AS occurred_at
        FROM public.transaction t
        WHERE user_id = trx_user_id
        AND type = ANY(trx_type)
        AND (ARRAY_LENGTH(categories, 1) IS NULL OR category_id = ANY(categories))
    ),
    trx_sum AS (
        SELECT
            sum(
                CASE WHEN t.type = 'expense' THEN -1 * t.amount
                ELSE t.amount
                END
            ) AS amount,
            CASE
                WHEN day_flow THEN
                    to_char(t.occurred_at, 'YYYY-MM-DD')
                WHEN month_end_date > 0 AND EXTRACT(DAY FROM t.occurred_at) > month_end_date THEN
                    to_char(t.occurred_at + interval '1 month', 'YYYY-MM')
                ELSE 
                    to_char(t.occurred_at, 'YYYY-MM')
            END AS occurred_at
        FROM
            trx t
        GROUP BY
            2
        ORDER BY 2
    )
    SELECT
        *
    FROM
        trx_sum t
    WHERE
        t.occurred_at >= start_str
        AND t.occurred_at <= end_str;
END;
$$ LANGUAGE plpgsql;