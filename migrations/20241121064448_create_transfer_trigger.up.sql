-- transfer created
CREATE OR REPLACE FUNCTION public.transfer_created()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.to_account_id, 1 * NEW.amount);
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, NEW.from_account_id, -1 * NEW.amount);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transfer_created_trigger
BEFORE INSERT ON "user_admin@gmail.com".transfer
FOR EACH ROW
EXECUTE PROCEDURE public.transfer_created();

-- transfer updated
CREATE OR REPLACE FUNCTION public.transfer_updated()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.to_account_id, 1 * (NEW.amount - OLD.amount));
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.from_account_id, -1 * (NEW.amount - OLD.amount));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transfer_updated_trigger
BEFORE UPDATE ON "user_admin@gmail.com".transfer
FOR EACH ROW WHEN (NEW.amount != OLD.amount)
EXECUTE PROCEDURE public.transfer_updated();

-- transfer deleted
CREATE OR REPLACE FUNCTION public.transfer_deleted()
RETURNS TRIGGER AS $$
BEGIN
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.to_account_id, -1 * OLD.amount);
    CALL public.update_account_balance(TG_TABLE_SCHEMA::VARCHAR, OLD.from_account_id, 1 * OLD.amount);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transfer_deleted_trigger
BEFORE DELETE ON "user_admin@gmail.com".transfer
FOR EACH ROW
EXECUTE PROCEDURE public.transfer_deleted();