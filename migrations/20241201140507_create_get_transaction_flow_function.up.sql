CREATE OR REPLACE FUNCTION get_transaction_flow(
    trx_user_id UUID,
    trx_type transaction_type,
    month_end_date INT,
    day_flow BOOLEAN,
    categories UUID[],
    time_zone VARCHAR
)
RETURNS TABLE(amount NUMERIC, occurred_at TEXT) 
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT
        sum(t.amount) AS amount,
        CASE
            WHEN day_flow THEN
                to_char(t.occurred_at AT TIME ZONE time_zone, 'YYYY-MM-DD')
            WHEN month_end_date > 0 AND EXTRACT(DAY FROM t.occurred_at AT TIME ZONE time_zone) > month_end_date THEN
                to_char((t.occurred_at AT TIME ZONE time_zone)::date + interval '1 month', 'YYYY-MM')
            ELSE 
                to_char(t.occurred_at AT TIME ZONE time_zone, 'YYYY-MM')
        END AS occurred_at
    FROM
        public.transaction t
    WHERE
        user_id = trx_user_id
        AND type = trx_type
        AND (ARRAY_LENGTH(categories, 1) IS NULL OR category_id = ANY(categories))
    GROUP BY
        2
    ORDER BY 2;
END;
$$ LANGUAGE plpgsql;