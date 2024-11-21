CREATE TABLE IF NOT EXISTS "user_admin@gmail.com".transfer (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    amount NUMERIC(17, 2) NOT NULL,
    from_account_id UUID NOT NULL,
    to_account_id UUID NOT NULL,
    category_id UUID NOT NULL,
    description VARCHAR(255) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    FOREIGN KEY (from_account_id) REFERENCES "user_admin@gmail.com".account (id),
    FOREIGN KEY (to_account_id) REFERENCES "user_admin@gmail.com".account (id),
    FOREIGN KEY (category_id) REFERENCES "user_admin@gmail.com".transfer_category (id)
);

-- transfer created
CREATE TRIGGER transfer_created_trigger
BEFORE INSERT ON "user_admin@gmail.com".transfer
FOR EACH ROW
EXECUTE PROCEDURE public.transfer_created();

-- transfer updated
CREATE TRIGGER transfer_updated_trigger
BEFORE UPDATE ON "user_admin@gmail.com".transfer
FOR EACH ROW WHEN (NEW.amount != OLD.amount)
EXECUTE PROCEDURE public.transfer_updated();

-- transfer deleted
CREATE TRIGGER transfer_deleted_trigger
AFTER DELETE ON "user_admin@gmail.com".transfer
FOR EACH ROW
EXECUTE PROCEDURE public.transfer_deleted();