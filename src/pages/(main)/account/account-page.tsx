import { AccountRepo } from '@/repo/account-repo';
import { appBarCtxAtom } from '@/stores/common';
import { Account } from '@/types/account.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AccountCard, AccountCardSkeleton } from './components/account-card';
import { openModal } from '@/stores/modal';
import { ModalAccountCreate } from './components/modal-account-create';

interface AccountPageProps {}

const AccountPage: FC<AccountPageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);

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
        (async () => {
            setLoading(true);
            const { data, error } = await AccountRepo.getAccounts();
            setLoading(false);
            if (error) {
                toast.error(error.message);
                return;
            }
            setAccounts(data ?? []);
        })();
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    Array.from({ length: 2 }).map((_, idx) => <AccountCardSkeleton key={idx} />)
                ) : accounts.length === 0 ? (
                    <p className="text-center">No accounts found</p>
                ) : (
                    accounts.map((account) => <AccountCard key={account.id} account={account} />)
                )}
            </div>
        </div>
    );
};

export default AccountPage;
