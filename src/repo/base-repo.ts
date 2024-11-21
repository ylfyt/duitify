import { schemaAtom } from '@/stores/auth';
import { supabase } from '@/supabase';
import { getDefaultStore } from 'jotai';

const store = getDefaultStore();

export class BaseRepo {
    public static get db() {
        return supabase.schema(store.get(schemaAtom));
    }
}
