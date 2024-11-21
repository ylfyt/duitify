CREATE TABLE IF NOT EXISTS "user_schema".expense (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    amount NUMERIC(17, 2) NOT NULL,
    category_id UUID NOT NULL,
    account_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    FOREIGN KEY (category_id) REFERENCES "user_schema".expense_category (id),
    FOREIGN KEY (account_id) REFERENCES "user_schema".account (id)
);

-- expense created
CREATE TRIGGER expense_created_trigger
BEFORE INSERT ON "user_schema".expense
FOR EACH ROW
EXECUTE PROCEDURE public.expense_created();

-- expense amount updated
CREATE TRIGGER expense_updated_trigger
BEFORE UPDATE ON "user_schema".expense
FOR EACH ROW WHEN (NEW.amount != OLD.amount)
EXECUTE PROCEDURE public.expense_updated();

-- expense deleted
CREATE TRIGGER expense_deleted_trigger
BEFORE DELETE ON "user_schema".expense
FOR EACH ROW
EXECUTE PROCEDURE public.expense_deleted();