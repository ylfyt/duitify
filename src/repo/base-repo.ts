import { schemaAtom } from '@/stores/auth';
import { supabase } from '@/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { getDefaultStore } from 'jotai';

export type QueryResultMany<T> = {
    data: T[] | null | undefined;
    error: PostgrestError | null;
};

export type QueryResultOne<T> = {
    data: T | null | undefined;
    error: PostgrestError | null;
};

const store = getDefaultStore();

export class BaseRepo {
    public static get db() {
        return supabase.schema(store.get(schemaAtom) as 'user_schema');
    }
}
