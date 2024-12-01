CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    pin VARCHAR(255) NULL,
    hide_amount BOOLEAN NULL,
    max_visible_amount FLOAT NULL,
    month_start_date INT NULL,
    FOREIGN KEY (user_id) REFERENCES "auth".users (id)
);

-- insert settings when user created
CREATE TRIGGER settings_created_trigger
AFTER INSERT ON "auth".users
FOR EACH ROW EXECUTE PROCEDURE public.settings_created();

-- supabase row level security
ALTER TABLE "public".settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user select"
ON "public".settings
FOR SELECT
TO authenticated
USING (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow user insert"
ON "public".settings
FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow user update"
ON "public".settings
FOR UPDATE
TO authenticated
USING (
    (select auth.uid()) = user_id
);

CREATE POLICY "Allow user delete"
ON "public".settings
FOR DELETE
TO authenticated
USING (
    (select auth.uid()) = user_id
);