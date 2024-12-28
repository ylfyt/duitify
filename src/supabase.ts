import { createClient } from '@supabase/supabase-js';
import { ENV } from './constants/env';
import { Database } from './database.types';

export const supabase = createClient<Database>(ENV.SUPABASE_PROJECT_URL, ENV.SUPABASE_ANON_KEY);

export const supabaseAccountImageBase = supabase.storage.from('images').getPublicUrl('accounts').data.publicUrl;
