export const ENV = {
    SUPABASE_PROJECT_URL: import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    BASE_URL: import.meta.env.BASE_URL.length > 1 ? import.meta.env.BASE_URL : '',
} as const;
