import { atom, getDefaultStore } from 'jotai';

const store = getDefaultStore();

// Global loading context
export const globalLoadingAtom = atom<boolean>(false);
export function showLoading(loading: boolean): boolean {
    store.set(globalLoadingAtom, loading);
    return loading;
}

export const expandAtom = atom<boolean>(true);
export const showNavAtom = atom(false);

type AppBarCtx = {
    title: string | JSX.Element;
    actions?: JSX.Element[];
    back?: boolean;
};
export const appBarCtxAtom = atom<AppBarCtx>({
    title: 'Duitify',
    actions: [],
});
