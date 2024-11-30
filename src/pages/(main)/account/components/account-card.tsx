import { DropdownMenu } from '@/components/dropdown-menu';
import Skeleton from '@/components/skeleton';
import { formatCurrency } from '@/helper/format-currency';
import { AccountRepo } from '@/repo/account-repo';
import { showLoading } from '@/stores/common';
import { showConfirm } from '@/stores/confirm';
import { openModal } from '@/stores/modal';
import { Account } from '@/types/account.type';
import { FC } from 'react';
import { toast } from 'react-toastify';
import { ModalAccountCreate } from './modal-account-create';
import { ENV } from '@/constants/env';
import { AmountRevealer } from '@/components/amount-revealer';
import { Link } from 'react-router-dom';

interface AccountCardProps {
    account: Account;
    onDeleted: (id: string) => void;
    onUpdated: (account: Account) => void;
}

export const AccountCard: FC<AccountCardProps> = ({ account, onDeleted, onUpdated }) => {
    const handleDelete = async () => {
        const confirmed = await showConfirm({
            title: 'Delete Account',
            body: 'Are you sure you want to delete this account?',
        });
        if (!confirmed) return;

        showLoading(true);
        const { error } = await AccountRepo.deleteAccount(account.id);
        showLoading(false);
        if (error) {
            toast.error(error.message);
            return;
        }
        onDeleted(account.id);
    };

    return (
        <Link to={`/accounts/transaction?account=${account.id}`}>
            <div className="flex items-center gap-4 rounded-xl bg-base-100 p-5 text-sm shadow-md">
                <img src={ENV.BASE_URL + account.logo} className="size-12"></img>
                <div className="flex flex-1 flex-col gap-0.5">
                    <p className="text-lg">{account.name}</p>
                    <div className="flex items-center gap-2">
                        <p>Balance: </p>
                        <span className={'font-semibold ' + (account.balance < 0 ? 'text-error' : 'text-success')}>
                            <AmountRevealer amount={account.balance} />
                        </span>
                    </div>
                </div>
                <DropdownMenu
                    options={[
                        {
                            icon: 'lucide:pencil',
                            label: 'Edit',
                            onClick: () => openModal(ModalAccountCreate, { account, onSuccess: onUpdated }),
                        },
                        {
                            icon: 'lucide:trash',
                            label: 'Delete',
                            onClick: handleDelete,
                        },
                    ]}
                />
            </div>
        </Link>
    );
};

interface AccountCardSkeletonProps {}

export const AccountCardSkeleton: FC<AccountCardSkeletonProps> = () => {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 p-5 text-sm shadow-md">
            <Skeleton>
                <div className="size-12 rounded-full bg-accent"></div>
            </Skeleton>
            <div className="flex flex-1 flex-col gap-0.5">
                <Skeleton>
                    <p className="text-lg">Gopay</p>
                </Skeleton>
                <Skeleton>
                    <div className="flex items-center gap-2">
                        <p>Balance: </p>
                        <p className={'font-bold'}>{formatCurrency(10_000_000)}</p>
                    </div>
                </Skeleton>
            </div>
            <Skeleton>
                <DropdownMenu options={[]} />
            </Skeleton>
        </div>
    );
};
