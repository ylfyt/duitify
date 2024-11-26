CREATE TABLE IF NOT EXISTS "user_schema".category (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255) NOT NULL,
    type category_type NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL
);

-- supabase row level security
ALTER TABLE "user_schema".category ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user schema"
ON "user_schema".category
TO authenticated
USING (
    ((( SELECT auth.jwt() AS jwt) ->> 'email'::text) = 'schema'::text)
);
