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

-- account updated
CREATE OR REPLACE FUNCTION public.account_updated()
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

-- transaction created
CREATE OR REPLACE FUNCTION public.transaction_created()
RETURNS TRIGGER AS $$
BEGIN
    -- if transaction is an expense
    IF NEW.type = 'expense' THEN
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, -1 * NEW.amount);
    -- if transaction is an income
    ELSIF NEW.type = 'income' THEN
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, 1 * NEW.amount);
    -- if transaction is a transfer
    ELSIF NEW.type = 'transfer' THEN
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.to_account_id, 1 * NEW.amount);
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, -1 * NEW.amount);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- transaction updated
CREATE OR REPLACE FUNCTION public.transaction_updated()
RETURNS TRIGGER AS $$
BEGIN
    -- if transaction is an expense
    IF NEW.type = 'expense' THEN
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, -1 * (NEW.amount - OLD.amount));
    -- if transaction is an income
    ELSIF NEW.type = 'income' THEN
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, 1 * (NEW.amount - OLD.amount));
    -- if transaction is a transfer
    ELSIF NEW.type = 'transfer' THEN
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.to_account_id, 1 * (NEW.amount - OLD.amount));
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, -1 * (NEW.amount - OLD.amount));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- transaction deleted
CREATE OR REPLACE FUNCTION public.transaction_deleted()
RETURNS TRIGGER AS $$
BEGIN
    -- if transaction is an expense
    IF OLD.type = 'expense' THEN
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.account_id, OLD.amount);
    -- if transaction is an income
    ELSIF OLD.type = 'income' THEN
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.account_id, -1 * OLD.amount);
    -- if transaction is a transfer
    ELSIF OLD.type = 'transfer' THEN
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.to_account_id, -1 * OLD.amount);
        CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.account_id, 1 * OLD.amount);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- validation before insert transaction
CREATE OR REPLACE FUNCTION public.transaction_validation()
RETURNS TRIGGER AS $$
BEGIN
    -- amount must be greater than 0
    IF NEW.amount <= 0 THEN
        RAISE EXCEPTION 'Amount must be greater than 0';
    END IF;
    IF NEW.type = 'transfer' AND NEW.to_account_id IS NULL THEN
        RAISE EXCEPTION 'Target account must not be null';
    END IF;
    -- cannot change transaction type
    IF TG_OP = 'UPDATE' AND NEW.type != OLD.type THEN
        RAISE EXCEPTION 'Cannot change transaction type';
    END IF;
    -- cannot change to_account_id and account_id
    IF TG_OP = 'UPDATE' AND NEW.type = 'transfer' AND NEW.to_account_id != OLD.to_account_id THEN
        RAISE EXCEPTION 'Cannot change target account';
    END IF;
    IF TG_OP = 'UPDATE' AND NEW.type = 'transfer' AND NEW.account_id != OLD.account_id THEN
        RAISE EXCEPTION 'Cannot change account';
    END IF;
    -- if transaction is a transfer, account_id and to_account_id must be different
    IF NEW.type = 'transfer' AND NEW.to_account_id = NEW.account_id THEN
        RAISE EXCEPTION 'Transfer must be between different accounts';
    END IF;
    -- if transaction is not transfer, category_id must not be null
    IF NEW.type != 'transfer' AND NEW.category_id IS NULL THEN
        RAISE EXCEPTION 'Category must not be null';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;