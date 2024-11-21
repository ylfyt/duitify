CREATE TABLE IF NOT EXISTS "user_admin@gmail.com".expense (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    amount NUMERIC(17, 2) NOT NULL,
    category_id UUID NOT NULL,
    account_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    FOREIGN KEY (category_id) REFERENCES "user_admin@gmail.com".expense_category (id),
    FOREIGN KEY (account_id) REFERENCES "user_admin@gmail.com".account (id)
)