import { Session } from '@supabase/supabase-js';
import { atom } from 'jotai';

export const userAtom = atom<Session | null>(null);
