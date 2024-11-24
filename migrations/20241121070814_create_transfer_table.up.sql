CREATE TABLE IF NOT EXISTS "user_schema".transfer (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    amount NUMERIC(17, 2) NOT NULL,
    from_account_id UUID NOT NULL,
    to_account_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    FOREIGN KEY (from_account_id) REFERENCES "user_schema".account (id),
    FOREIGN KEY (to_account_id) REFERENCES "user_schema".account (id)
);

-- transfer created
CREATE TRIGGER transfer_created_trigger
BEFORE INSERT ON "user_schema".transfer
FOR EACH ROW
EXECUTE PROCEDURE public.transfer_created();

-- transfer updated
CREATE TRIGGER transfer_updated_trigger
BEFORE UPDATE ON "user_schema".transfer
FOR EACH ROW WHEN (NEW.amount != OLD.amount)
EXECUTE PROCEDURE public.transfer_updated();

-- transfer deleted
CREATE TRIGGER transfer_deleted_trigger
AFTER DELETE ON "user_schema".transfer
FOR EACH ROW
EXECUTE PROCEDURE public.transfer_deleted();