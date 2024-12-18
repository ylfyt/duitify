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
DECLARE 
    start_date DATE;
    end_date DATE;
BEGIN
    IF day_flow THEN
        start_date := start_str::TIMESTAMP AT TIME ZONE time_zone;
        end_date := (end_str::DATE + INTERVAL '1 day') AT TIME ZONE time_zone;
    ELSE
        start_date := (start_str || '-01')::DATE AT TIME ZONE time_zone;
        end_date := (end_str || '-01')::DATE AT TIME ZONE time_zone + INTERVAL '1 month';
        IF month_end_date > 0 THEN
            start_date := start_date - INTERVAL '1 month';
            start_date := start_date + month_end_date;
            end_date := end_date - INTERVAL '1 month';
            end_date := end_date + month_end_date;
        END IF;
    END IF;

    RETURN QUERY
    SELECT
        sum(
            CASE WHEN t.type = 'expense' THEN -1 * t.amount
            ELSE t.amount
            END
        ) AS amount,
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
        AND t.type = ANY(trx_type)
        AND (ARRAY_LENGTH(categories, 1) IS NULL OR category_id = ANY(categories))
        AND t.occurred_at >= start_date
        AND t.occurred_at < end_date
    GROUP BY
        2
    ORDER BY 2;
END;
$$ LANGUAGE plpgsql;