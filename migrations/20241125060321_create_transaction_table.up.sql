CREATE TABLE IF NOT EXISTS "user_schema".transaction (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    amount NUMERIC(17, 2) NOT NULL,
    type transaction_type NOT NULL,
    account_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    category_id UUID NULL,
    to_account_id UUID NULL,
    FOREIGN KEY (category_id) REFERENCES "user_schema".category (id),
    FOREIGN KEY (account_id) REFERENCES "user_schema".account (id),
    FOREIGN KEY (to_account_id) REFERENCES "user_schema".account (id)
);

-- validation before insert and update
CREATE TRIGGER transaction_validation_trigger
BEFORE INSERT OR UPDATE ON "user_schema".transaction
FOR EACH ROW
EXECUTE PROCEDURE public.transaction_validation();

-- transaction created
CREATE TRIGGER transaction_created_trigger
BEFORE INSERT ON "user_schema".transaction
FOR EACH ROW
EXECUTE PROCEDURE public.transaction_created();

-- transaction amount updated
CREATE TRIGGER transaction_updated_trigger
BEFORE UPDATE ON "user_schema".transaction
FOR EACH ROW WHEN (NEW.amount != OLD.amount)
EXECUTE PROCEDURE public.transaction_updated();

-- transaction deleted
CREATE TRIGGER transaction_deleted_trigger
BEFORE DELETE ON "user_schema".transaction
FOR EACH ROW
EXECUTE PROCEDURE public.transaction_deleted();