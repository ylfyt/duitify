import { supabase } from '@/supabase';

export const ACCOUNT_LOGO_BASE = supabase.storage.from('images').getPublicUrl('accounts').data.publicUrl;
export const CATEGORY_LOGO_BASE = supabase.storage.from('images').getPublicUrl('categories').data.publicUrl;
