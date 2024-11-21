import { WritableAtom } from 'jotai';
import { atom } from 'jotai';

export function atomWithStorage<T>(key: string, initialValue: T | (() => T)): WritableAtom<T, [T], void> {
    let init: T;
    if (typeof initialValue === 'function') init = (initialValue as () => T)();
    else init = initialValue;

    const getValueOrInit = () => {
        const raw = localStorage.getItem(key);
        if (raw == null) return init;

        try {
            return (typeof init === 'string' ? raw : JSON.parse(raw)) as T;
        } catch {
            return init;
        }
    };

    const baseAtom = atom<T>(getValueOrInit());
    const derivedAtom = atom<T, [T], void>(
        (get) => get(baseAtom),
        (get, set, update) => {
            const value = typeof update === 'function' ? update(get(baseAtom)) : update;

            set(baseAtom, value);
            try {
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            } catch (e) {
                console.error(e);
            }
        }
    );
    return derivedAtom;
}
