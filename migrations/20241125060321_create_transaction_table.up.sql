CREATE TABLE IF NOT EXISTS "public".transaction (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    amount NUMERIC(17, 2) NOT NULL,
    type transaction_type NOT NULL,
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    category_id UUID NULL,
    to_account_id UUID NULL,
    FOREIGN KEY (category_id) REFERENCES "public".category (id),
    FOREIGN KEY (account_id) REFERENCES "public".account (id),
    FOREIGN KEY (to_account_id) REFERENCES "public".account (id),
    FOREIGN KEY (user_id) REFERENCES "auth".users (id)
);

-- validation before insert and update
CREATE TRIGGER transaction_validation_trigger
BEFORE INSERT OR UPDATE ON "public".transaction
FOR EACH ROW
EXECUTE PROCEDURE public.transaction_validation();

-- transaction created
CREATE TRIGGER transaction_created_trigger
BEFORE INSERT ON "public".transaction
FOR EACH ROW
EXECUTE PROCEDURE public.transaction_created();

-- transaction amount updated
CREATE TRIGGER transaction_updated_trigger
BEFORE UPDATE ON "public".transaction
FOR EACH ROW WHEN (NEW.amount != OLD.amount)
EXECUTE PROCEDURE public.transaction_updated();

-- transaction deleted
CREATE TRIGGER transaction_deleted_trigger
BEFORE DELETE ON "public".transaction
FOR EACH ROW
EXECUTE PROCEDURE public.transaction_deleted();

-- supabase row level security
ALTER TABLE "public".transaction ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select"
ON "public".transaction
FOR SELECT
TO authenticated
USING (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow insert"
ON "public".transaction
FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.uid()) = user_id 
    AND auth.uid() IN (
        SELECT user_id FROM "public".account WHERE id = account_id
    )
    AND (
        to_account_id IS NULL
        OR auth.uid() IN (
            SELECT user_id FROM "public".account WHERE id = to_account_id
        )
    )
    AND (
        category_id IS NULL
        OR auth.uid() IN (
            SELECT user_id FROM "public".category WHERE id = category_id
        )
    )
);

CREATE POLICY "Allow update"
ON "public".transaction
FOR UPDATE
TO authenticated
USING (
    (select auth.uid()) = user_id
)
WITH CHECK (
    (select auth.uid()) = user_id
    AND (
        category_id IS NULL
        OR auth.uid() IN (
            SELECT user_id FROM "public".category WHERE id = category_id
        )
    )
);

CREATE POLICY "Allow delete"
ON "public".transaction
FOR DELETE
TO authenticated
USING (
    (select auth.uid()) = user_id
);
