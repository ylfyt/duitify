export const ENV = {
    SUPABASE_PROJECT_URL: import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
} as const;
