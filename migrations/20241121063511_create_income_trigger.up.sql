-- income created
CREATE OR REPLACE FUNCTION public.income_created()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, 1 * NEW.amount);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER income_created_trigger
BEFORE INSERT ON "user_admin@gmail.com".income
FOR EACH ROW
EXECUTE PROCEDURE public.income_created();

-- income updated
CREATE OR REPLACE FUNCTION public.income_updated()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.account_id, 1 * (NEW.amount - OLD.amount));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER income_updated_trigger
BEFORE UPDATE ON "user_admin@gmail.com".income
FOR EACH ROW
EXECUTE PROCEDURE public.income_updated();

-- income deleted
CREATE OR REPLACE FUNCTION public.income_deleted()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.account_id, -1 * OLD.amount);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER income_deleted_trigger
BEFORE DELETE ON "user_admin@gmail.com".income
FOR EACH ROW
EXECUTE PROCEDURE public.income_deleted();