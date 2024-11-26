import { Session } from '@supabase/supabase-js';
import { atom } from 'jotai';

export const sessionAtom = atom<Session | null>(null);

export const schemaAtom = atom<string>((get) => {
    const email = get(sessionAtom)?.user.email;
    if (!email) return 'public';
    // return 'public';
    return `user_${email}`;
});
