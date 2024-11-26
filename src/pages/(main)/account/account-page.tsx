import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AccountCard, AccountCardSkeleton } from './components/account-card';
import { openModal } from '@/stores/modal';
import { ModalAccountCreate } from './components/modal-account-create';
import { useAccountAtom } from '@/stores/account';

interface AccountPageProps {}

const AccountPage: FC<AccountPageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    const { data: accounts, setData: setAccounts, loading, fetched, refresh } = useAccountAtom();

    useEffect(() => {
        setAppBarCtx({
            title: 'Accounts',
            actions: [
                <button
                    onClick={() =>
                        openModal(ModalAccountCreate, {
                            onSuccess: (account) => setAccounts((prev) => [account, ...prev]),
                        })
                    }
                    className="dai-btn dai-btn-success dai-btn-sm"
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
