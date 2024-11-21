import { Session } from '@supabase/supabase-js';
import { atom } from 'jotai';

export const userAtom = atom<Session | null>(null);

export const schemaAtom = atom<'public'>((get) => {
    const email = get(userAtom)?.user.email;
    if (!email) return 'public';
    return 'public';
    // return `user_${email}`;
});
