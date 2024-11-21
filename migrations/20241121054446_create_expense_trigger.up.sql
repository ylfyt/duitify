-- expense created
CREATE OR REPLACE FUNCTION public.expense_created()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, -1 * NEW.amount);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expense_created_trigger
BEFORE INSERT ON "user_admin@gmail.com".expense
FOR EACH ROW
EXECUTE PROCEDURE public.expense_created();

-- expense amount updated
CREATE OR REPLACE FUNCTION public.expense_amount_updated()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.account_id, -1 * (NEW.amount - OLD.amount));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expense_amount_updated_trigger
BEFORE UPDATE ON "user_admin@gmail.com".expense
FOR EACH ROW WHEN (NEW.amount != OLD.amount)
EXECUTE PROCEDURE public.expense_amount_updated();

-- expense deleted
CREATE OR REPLACE FUNCTION public.expense_deleted()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.account_id, OLD.amount);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expense_deleted_trigger
BEFORE DELETE ON "user_admin@gmail.com".expense
FOR EACH ROW
EXECUTE PROCEDURE public.expense_deleted();