import { AccountRepo } from '@/repo/account-repo';
import { Account } from '@/types/account.type';
import { FetchAtom } from '@/types/common';
import { atom, getDefaultStore, useAtom } from 'jotai';
import { sessionAtom } from './auth';

const store = getDefaultStore();

const internalBondsAtom = atom<FetchAtom<Account[]>>({
    loading: false,
    fetched: false,
    data: [],
});

async function refresh(): Promise<string | undefined> {
    store.set(internalBondsAtom, (prev) => ({ ...prev, loading: true, fetched: false }));
    const res = await AccountRepo.getAccounts(store.get(sessionAtom)?.user.id ?? '');
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

function setData(data: Account[] | ((prev: Account[]) => Account[])) {
    const val = store.get(internalBondsAtom);
    if (!val.fetched) return;
    store.set(internalBondsAtom, {
        ...val,
        data: typeof data === 'function' ? data(val.data) : data,
    });
}

const accountsAtom = atom((get) => ({
    refresh,
    setData,
    ...get(internalBondsAtom),
}));

export const useAccountAtom = () => {
    const [accounts] = useAtom(accountsAtom);
    return accounts;
};
