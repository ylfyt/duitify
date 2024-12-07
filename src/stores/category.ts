import { CategoryRepo } from '@/repo/category-repo';
import { Category } from '@/types/category.type';
import { FetchAtom } from '@/types/common';
import { atom, getDefaultStore, useAtom } from 'jotai';
import { sessionAtom } from './auth';

const store = getDefaultStore();

const internalBondsAtom = atom<FetchAtom<Category[]>>({
    loading: false,
    fetched: false,
    data: [],
});

async function refresh(): Promise<string | undefined> {
    store.set(internalBondsAtom, (prev) => ({ ...prev, loading: true, fetched: false }));
    const res = await CategoryRepo.getCategories(store.get(sessionAtom)?.user.id ?? '');
    if (res.error) {
        store.set(internalBondsAtom, (prev) => ({ ...prev, loading: false }));
        return res.error.message;
    }
    store.set(internalBondsAtom, {
        loading: false,
        fetched: true,
        data: res.data ?? [],
    });
}

function setData(data: Category[] | ((prev: Category[]) => Category[])) {
    const val = store.get(internalBondsAtom);
    if (!val.fetched) return;
    store.set(internalBondsAtom, {
        ...val,
        data: typeof data === 'function' ? data(val.data) : data,
    });
}

const categoriesAtom = atom((get) => ({
    refresh,
    setData,
    ...get(internalBondsAtom),
}));

export const useCategoryAtom = () => {
    const [atom] = useAtom(categoriesAtom);
    return atom;
};
