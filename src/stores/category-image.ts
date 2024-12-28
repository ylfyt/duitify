import { FetchAtom } from '@/types/common';
import { atom, getDefaultStore, useAtom } from 'jotai';
import { supabase } from '@/supabase';

const store = getDefaultStore();

const internalAtom = atom<FetchAtom<string[]>>({
    loading: false,
    fetched: false,
    data: [],
});

async function refresh(): Promise<string | undefined> {
    store.set(internalAtom, (prev) => ({ ...prev, loading: true, fetched: false }));
    const res = await supabase.storage.from('images').list('categories');
    if (res.error) {
        store.set(internalAtom, (prev) => ({ ...prev, loading: false }));
        return res.error.message;
    }
    store.set(internalAtom, {
        loading: false,
        fetched: true,
        data: (res.data ?? []).map((el) => el.name),
    });
}

function setData(data: string[] | ((prev: string[]) => string[])) {
    const val = store.get(internalAtom);
    if (!val.fetched) return;
    store.set(internalAtom, {
        ...val,
        data: typeof data === 'function' ? data(val.data) : data,
    });
}

const categoriesAtom = atom((get) => ({
    refresh,
    setData,
    ...get(internalAtom),
}));

export const useCategoryImageAtom = () => {
    const [atom] = useAtom(categoriesAtom);
    return atom;
};
