CREATE OR REPLACE FUNCTION get_income_expense_per_month (
    trx_user_id UUID,
    month_end_date INT,
    time_zone VARCHAR,
    start_str VARCHAR,
    end_str VARCHAR
)
RETURNS TABLE(occurred_at TEXT, income NUMERIC, expense NUMERIC)
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    with trx as (
        select 
            CASE WHEN month_end_date > 0 AND EXTRACT(DAY FROM t.occurred_at AT TIME ZONE time_zone) > month_end_date 
                THEN to_char((t.occurred_at AT TIME ZONE time_zone) + interval '1 month', 'YYYY-MM')
                ELSE to_char(t.occurred_at AT TIME ZONE time_zone, 'YYYY-MM') END AS occurred_at,
            type, 
            sum(amount) as amount
        from 
            public.transaction t
        where 
            t.user_id = trx_user_id 
            and t.type != 'transfer'
            and t.occurred_at AT TIME ZONE time_zone >= start_str::TIMESTAMP
            and t.occurred_at AT TIME ZONE time_zone < end_str::TIMESTAMP
        group by 1, 2
    )
    select
        t.occurred_at,
        coalesce(SUM(t.amount) FILTER (WHERE type = 'income'), 0) AS income,
        coalesce(SUM(t.amount) FILTER (WHERE type = 'expense'), 0) AS expense
    from trx t
    group by 1
    order by 1 desc;
END;
$$ LANGUAGE plpgsql;