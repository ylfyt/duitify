import { removeSuffix } from '@/helper/str';

export const ENV = {
    SUPABASE_PROJECT_URL: import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    BASE_URL: removeSuffix(import.meta.env.BASE_URL, '/'),
} as const;
