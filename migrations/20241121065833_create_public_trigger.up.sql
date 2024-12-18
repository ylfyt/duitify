-- procedure to update account balance with param schema_name, id, and delta
CREATE OR REPLACE PROCEDURE public.update_account_balance(account_id UUID, delta NUMERIC)
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    UPDATE public.account
    SET balance = balance + delta
    WHERE id = account_id;
END; $$;

-- account updated
CREATE OR REPLACE FUNCTION public.account_updated()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    CALL public.update_account_balance(NEW.id, NEW.initial_balance - OLD.initial_balance);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- account created
CREATE OR REPLACE FUNCTION public.account_created()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    NEW.balance := NEW.initial_balance;
    CALL public.update_account_balance(NEW.id, NEW.initial_balance);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- transaction created
CREATE OR REPLACE FUNCTION public.transaction_created()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    -- if transaction is an expense
    IF NEW.type = 'expense' THEN
        CALL public.update_account_balance(NEW.account_id, -1 * NEW.amount);
    -- if transaction is an income
    ELSIF NEW.type = 'income' THEN
        CALL public.update_account_balance(NEW.account_id, 1 * NEW.amount);
    -- if transaction is a transfer
    ELSIF NEW.type = 'transfer' THEN
        CALL public.update_account_balance(NEW.to_account_id, 1 * NEW.amount);
        CALL public.update_account_balance(NEW.account_id, -1 * NEW.amount);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- transaction updated
CREATE OR REPLACE FUNCTION public.transaction_updated()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    -- if transaction is an expense
    IF NEW.type = 'expense' THEN
        CALL public.update_account_balance(NEW.account_id, -1 * (NEW.amount - OLD.amount));
    -- if transaction is an income
    ELSIF NEW.type = 'income' THEN
        CALL public.update_account_balance(NEW.account_id, 1 * (NEW.amount - OLD.amount));
    -- if transaction is a transfer
    ELSIF NEW.type = 'transfer' THEN
        CALL public.update_account_balance(NEW.to_account_id, 1 * (NEW.amount - OLD.amount));
        CALL public.update_account_balance(NEW.account_id, -1 * (NEW.amount - OLD.amount));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- transaction deleted
CREATE OR REPLACE FUNCTION public.transaction_deleted()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    -- if transaction is an expense
    IF OLD.type = 'expense' THEN
        CALL public.update_account_balance(OLD.account_id, OLD.amount);
    -- if transaction is an income
    ELSIF OLD.type = 'income' THEN
        CALL public.update_account_balance(OLD.account_id, -1 * OLD.amount);
    -- if transaction is a transfer
    ELSIF OLD.type = 'transfer' THEN
        CALL public.update_account_balance(OLD.to_account_id, -1 * OLD.amount);
        CALL public.update_account_balance(OLD.account_id, 1 * OLD.amount);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- validation before insert transaction
CREATE OR REPLACE FUNCTION public.transaction_validation()
RETURNS TRIGGER 
SET search_path = ''
AS $$
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
    IF TG_OP = 'UPDATE' AND NEW.account_id != OLD.account_id THEN
        RAISE EXCEPTION 'Cannot change account';
    END IF;
    -- cannot change to_account_id and account_id
    IF TG_OP = 'UPDATE' AND NEW.type = 'transfer' AND NEW.to_account_id != OLD.to_account_id THEN
        RAISE EXCEPTION 'Cannot change target account';
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

-- insert settings when user created
CREATE OR REPLACE FUNCTION public.settings_created()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.settings (user_id, pin, hide_amount, max_visible_amount)
    VALUES (NEW.id, NULL, FALSE, NULL);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;