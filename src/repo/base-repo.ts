import { supabase } from '@/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export type QueryResultMany<T> = {
    data: T[] | null | undefined;
    error: PostgrestError | null;
};

export type QueryResultOne<T> = {
    data: T | null | undefined;
    error: PostgrestError | null;
};

export type QueryResultEmpty = {
    data: null;
    error: PostgrestError | null;
};

export class BaseRepo {
    public static get db() {
        return supabase.schema('public');
    }
}
