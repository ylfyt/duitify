CREATE TABLE IF NOT EXISTS "public".account (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    initial_balance NUMERIC(17, 2) NOT NULL,
    balance NUMERIC(17, 2) NOT NULL DEFAULT 0,
    logo VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    FOREIGN KEY (user_id) REFERENCES "auth".users (id)
);

-- account created
CREATE TRIGGER account_created_trigger
AFTER INSERT ON "public".account
FOR EACH ROW EXECUTE PROCEDURE public.account_created();

-- account updated
CREATE TRIGGER account_updated_trigger
AFTER UPDATE ON "public".account
FOR EACH ROW WHEN (NEW.initial_balance != OLD.initial_balance)
EXECUTE PROCEDURE public.account_updated();

-- supabase row level security
ALTER TABLE "public".account ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select"
ON "public".account
FOR SELECT
TO authenticated
USING (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow user insert"
ON "public".account
FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow user update"
ON "public".account
FOR UPDATE
TO authenticated
USING (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow user delete"
ON "public".account
FOR DELETE
TO authenticated
USING (
    (select auth.uid()) = user_id
);