import { createClient } from '@supabase/supabase-js';
import { ENV } from './constants/env';
import { Database } from './database.types';
import { storage } from '@/types/storage.type';

export const supabase = createClient<Database>(ENV.SUPABASE_PROJECT_URL, ENV.SUPABASE_ANON_KEY, {
    auth: {
        storage,
    },
});
