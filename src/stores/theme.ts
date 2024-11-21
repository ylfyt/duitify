import { COLOR_SCHEMES } from '@/constants/color-schemes';
import { atomWithStorage } from '@/hooks/use-local-storage';
import { atom } from 'jotai';

type ThemeName = keyof typeof COLOR_SCHEMES;

export const isDarkAtom = atomWithStorage('dark', false);
export const themeNameAtom = atom<ThemeName>((get) => (get(isDarkAtom) ? 'dark' : 'light'));
export const colorSchemeAtom = atom((get) => COLOR_SCHEMES[get(themeNameAtom)]);
