import { PAGINATION_SIZES } from '@/constants/common';
import { TransactionRepo } from '@/repo/transaction-repo';
import { FetchAtom } from '@/types/common';
import { Transaction } from '@/types/transaction.type';
import { atom, getDefaultStore, useAtom } from 'jotai';

const store = getDefaultStore();

const internalAtom = atom<
    FetchAtom<Transaction[]> & {
        cursor?: string;
        hasMore: boolean;
        isFirst: boolean;
    }
>({
    loading: false,
    fetched: false,
    isFirst: true,
    hasMore: false,
    data: [],
});

async function load(): Promise<string | undefined> {
    const curr = store.get(internalAtom);
    const cursor = curr.data[curr.data.length - 1]?.occurred_at;
    store.set(internalAtom, (prev) => ({
        ...prev,
        loading: true,
        fetched: false,
        cursor: cursor,
    }));
    const res = await TransactionRepo.getTransactions({ cursor });
    if (res.error) {
        store.set(internalAtom, (prev) => ({ ...prev, loading: false, hasMore: false }));
        return res.error.message;
    }
    store.set(internalAtom, (prev) => {
        return {
            fetched: true,
            loading: false,
            data: [...prev.data, ...(res.data ?? [])],
            hasMore: (res.data?.length ?? 0) >= PAGINATION_SIZES[0],
            isFirst: false,
        };
    });
}

function setData(data: Transaction[] | ((prev: Transaction[]) => Transaction[])) {
    const val = store.get(internalAtom);
    if (!val.fetched) return;
    store.set(internalAtom, {
        ...val,
        data: typeof data === 'function' ? data(val.data) : data,
    });
}

const transactionAtom = atom((get) => ({
    load,
    setData,
    ...get(internalAtom),
}));

export const useTransactionAtom = () => {
    const [atom] = useAtom(transactionAtom);
    return atom;
};
