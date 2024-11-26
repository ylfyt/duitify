CREATE TABLE IF NOT EXISTS "public".category (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255) NOT NULL,
    type category_type NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES "auth".users (id)
);

-- supabase row level security
ALTER TABLE "public".category ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user schema"
ON "public".category
FOR SELECT
TO authenticated
USING (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow user insert"
ON "public".category
FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow user update"
ON "public".category
FOR UPDATE
TO authenticated
USING (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow user delete"
ON "public".category
FOR DELETE
TO authenticated
USING (
    (select auth.uid()) = user_id
);
