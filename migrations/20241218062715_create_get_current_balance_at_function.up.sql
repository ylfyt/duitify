CREATE OR REPLACE FUNCTION get_current_balance_at(
    trx_user_id UUID,
    month_end_date INT,
    day_flow BOOLEAN,
    end_str VARCHAR,
    time_zone VARCHAR
)
RETURNS NUMERIC
SET search_path = ''
AS $$
DECLARE
    result NUMERIC;
BEGIN
    WITH delta AS (
        SELECT SUM(amount) AS amount FROM public.get_transaction_flow(
            trx_user_id,
            ARRAY['expense'::public.transaction_type, 'income'::public.transaction_type],
            month_end_date,
            day_flow,
            '{}'::UUID[],
            time_zone,
            (CASE WHEN day_flow THEN '1970-01-01'::VARCHAR ELSE '1970-01' END)::VARCHAR,
            end_str
        )
    ),
    account AS (
        SELECT SUM(initial_balance) AS balance FROM public.account WHERE user_id = trx_user_id
    )
    SELECT balance + (CASE WHEN amount IS NULL THEN 0 ELSE amount END) INTO result FROM delta, account;

    RETURN result;
END;
$$ LANGUAGE plpgsql;