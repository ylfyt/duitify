CREATE TABLE IF NOT EXISTS "user_schema".account (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    initial_balance NUMERIC(17, 2) NOT NULL,
    balance NUMERIC(17, 2) NOT NULL DEFAULT 0,
    logo VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL
);

-- account created
CREATE TRIGGER account_created_trigger
AFTER INSERT ON "user_schema".account
FOR EACH ROW EXECUTE PROCEDURE public.account_created();

-- account updated
CREATE TRIGGER account_updated_trigger
AFTER UPDATE ON "user_schema".account
FOR EACH ROW WHEN (NEW.initial_balance != OLD.initial_balance)
EXECUTE PROCEDURE public.account_updated();

-- supabase row level security
ALTER TABLE "user_schema".account ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user schema"
ON "user_schema".account
TO authenticated
USING (
    ((( SELECT auth.jwt() AS jwt) ->> 'email'::text) = 'schema'::text)
);
