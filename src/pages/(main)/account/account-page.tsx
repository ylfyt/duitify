import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { AccountCard, AccountCardSkeleton } from './components/account-card';
import { openModal } from '@/stores/modal';
import { ModalAccountCreate } from './components/modal-account-create';
import { useAccountAtom } from '@/stores/account';
import { formatCurrency } from '@/helper/format-currency';
import Skeleton from '@/components/skeleton';
import { AmountRevealer } from '@/components/amount-revealer';

interface AccountPageProps {}

const AccountPage: FC<AccountPageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    const { data: accounts, setData: setAccounts, loading, fetched, refresh } = useAccountAtom();

    const totalBalance = useMemo(() => accounts.reduce((prev, acc) => prev + acc.balance, 0), [accounts]);

    useEffect(() => {
        setAppBarCtx({
            title: 'Accounts',
            revealer: true,
            actions: [
                <button
                    onClick={() =>
                        openModal(ModalAccountCreate, {
                            onSuccess: (account) => setAccounts((prev) => [account, ...prev]),
                        })
                    }
                    className="dai-btn dai-btn-success dai-btn-sm ml-2"
                >
                    Create
                </button>,
            ],
        });
    }, []);

    useEffect(() => {
        if (fetched) return;
        (async () => {
            const msg = await refresh();
            if (!msg) return;
            toast.error(msg);
        })();
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <div className="rounded-xl bg-base-100 p-4">
                <div className="flex items-center gap-2">
                    <span>{loading ? <Skeleton>Total:</Skeleton> : 'Total:'}</span>
                    <span className="font-medium text-primary">
                        {loading ? (
                            <Skeleton>{formatCurrency(10_000_000)}</Skeleton>
                        ) : (
                            <AmountRevealer amount={totalBalance} />
                        )}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {loading ? (
                    Array.from({ length: 2 }).map((_, idx) => <AccountCardSkeleton key={idx} />)
                ) : accounts.length === 0 ? (
                    <p className="text-center">No accounts found</p>
                ) : (
                    accounts.map((account) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onDeleted={(id) => {
                                setAccounts((prev) => prev.filter((acc) => acc.id !== id));
                            }}
                            onUpdated={(account) => {
                                setAccounts((prev) => prev.map((acc) => (acc.id === account.id ? account : acc)));
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AccountPage;
