-- procedure to update account balance with param schema_name, id, and delta
CREATE OR REPLACE PROCEDURE public.update_account_balance(schema_name VARCHAR, account_id UUID, delta NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
    EXECUTE format(
        'UPDATE %I.account SET balance = balance + $1 WHERE id = $2',
        schema_name
    )
    USING delta, account_id;
END; $$;

CREATE OR REPLACE FUNCTION public.update_account_initial_balance()
RETURNS TRIGGER AS $$
BEGIN
    CALL update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.id, NEW.initial_balance - OLD.initial_balance);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_account_created()
RETURNS TRIGGER AS $$
BEGIN
    NEW.balance := NEW.initial_balance;
    CALL update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.id, NEW.initial_balance);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- postgres trigger to upadate balance = initial_balance when account is created
CREATE TRIGGER update_account_created_trigger
AFTER INSERT ON "user_yudi.alfayet99@gmail.com".account
FOR EACH ROW EXECUTE PROCEDURE update_account_created();

-- TRIGGER TO update balance when initial_balance is updated
CREATE TRIGGER update_account_initial_balance_trigger
AFTER UPDATE ON "user_yudi.alfayet99@gmail.com".account
FOR EACH ROW WHEN (NEW.initial_balance != OLD.initial_balance)
EXECUTE PROCEDURE public.update_account_initial_balance();

