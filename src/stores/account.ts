import { AccountRepo } from '@/repo/account-repo';
import { Account } from '@/types/account.type';
import { atom, getDefaultStore } from 'jotai';

const store = getDefaultStore();

type AccountAtom = {
    loading: boolean;
    data: Account[];
    fetched: boolean;
};

const internalBondsAtom = atom<AccountAtom>({
    loading: false,
    fetched: false,
    data: [],
});

async function refresh(): Promise<string | undefined> {
    store.set(internalBondsAtom, (prev) => ({ ...prev, loading: true, fetched: false }));
    const res = await AccountRepo.getAccounts();
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

export const accountsAtom = atom((get) => ({
    refresh,
    ...get(internalBondsAtom),
}));
