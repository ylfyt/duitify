import { Settings } from '@/types/settings.type';
import { atom } from 'jotai';

export const revealAmountAtom = atom<boolean>(false);
export const settingsAtom = atom<Settings | undefined>();
export const pinAuthenticatedAtom = atom<boolean>(false);
