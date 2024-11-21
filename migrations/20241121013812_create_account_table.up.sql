CREATE TABLE IF NOT EXISTS "user_yudi.alfayet99@gmail.com".account (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    initial_balance NUMERIC(17, 2) NOT NULL,
    balance NUMERIC(17, 2) NOT NULL DEFAULT 0,
    logo VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL
);
