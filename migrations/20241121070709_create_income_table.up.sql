CREATE TABLE IF NOT EXISTS "user_schema".income (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    amount NUMERIC(17, 2) NOT NULL,
    account_id UUID NOT NULL,
    category_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    FOREIGN KEY (account_id) REFERENCES "user_schema".account (id),
    FOREIGN KEY (category_id) REFERENCES "user_schema".income_category (id)
);

-- income created
CREATE TRIGGER income_created_trigger
BEFORE INSERT ON "user_schema".income
FOR EACH ROW
EXECUTE PROCEDURE public.income_created();

-- income updated
CREATE TRIGGER income_updated_trigger
BEFORE UPDATE ON "user_schema".income
FOR EACH ROW WHEN (NEW.amount != OLD.amount)
EXECUTE PROCEDURE public.income_updated();

-- income deleted
CREATE TRIGGER income_deleted_trigger
BEFORE DELETE ON "user_schema".income
FOR EACH ROW
EXECUTE PROCEDURE public.income_deleted();