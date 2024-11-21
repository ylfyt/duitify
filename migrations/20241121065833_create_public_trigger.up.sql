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

-- account created
CREATE OR REPLACE FUNCTION public.account_created()
RETURNS TRIGGER AS $$
BEGIN
    NEW.balance := NEW.initial_balance;
    CALL update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.id, NEW.initial_balance);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- expense created
CREATE OR REPLACE FUNCTION public.expense_created()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, -1 * NEW.amount);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- expense amount updated
CREATE OR REPLACE FUNCTION public.expense_amount_updated()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, -1 * (NEW.amount - OLD.amount));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- expense deleted
CREATE OR REPLACE FUNCTION public.expense_deleted()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.account_id, OLD.amount);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- income created
CREATE OR REPLACE FUNCTION public.income_created()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, 1 * NEW.amount);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- income updated
CREATE OR REPLACE FUNCTION public.income_updated()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.account_id, 1 * (NEW.amount - OLD.amount));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- income deleted
CREATE OR REPLACE FUNCTION public.income_deleted()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.account_id, -1 * OLD.amount);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- transfer created
CREATE OR REPLACE FUNCTION public.transfer_created()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.to_account_id, 1 * NEW.amount);
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.from_account_id, -1 * NEW.amount);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- transfer updated
CREATE OR REPLACE FUNCTION public.transfer_updated()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.to_account_id, 1 * (NEW.amount - OLD.amount));
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.from_account_id, -1 * (NEW.amount - OLD.amount));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- transfer deleted
CREATE OR REPLACE FUNCTION public.transfer_deleted()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.to_account_id, -1 * OLD.amount);
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.from_account_id, 1 * OLD.amount);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;