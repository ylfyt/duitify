import { DropdownMenu } from '@/components/dropdown-menu';
import Skeleton from '@/components/skeleton';
import { formatCurrency } from '@/helper/format-currency';
import { AccountRepo } from '@/repo/account-repo';
import { showLoading } from '@/stores/common';
import { showConfirm } from '@/stores/confirm';
import { Account } from '@/types/account.type';
import { FC } from 'react';
import { toast } from 'react-toastify';
import { AmountRevealer } from '@/components/amount-revealer';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_LOGO_BASE } from '@/constants/logo';

interface AccountCardProps {
    account: Account;
    onDeleted: (id: string) => void;
}

export const AccountCard: FC<AccountCardProps> = ({ account, onDeleted }) => {
    const navigate = useNavigate();

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
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 text-sm shadow-md hover:cursor-pointer">
            <img
                onClick={() => navigate(`/accounts/transaction?account=${account.id}`)}
                src={ACCOUNT_LOGO_BASE + '/' + account.logo}
                className="size-6 xs:size-9"
            ></img>
            <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm xs:text-base">{account.name}</p>
                <div className="flex items-center gap-2 text-xs xs:text-sm">
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
                        onClick: () => navigate(`/accounts/${account.id}`),
                    },
                    {
                        icon: 'lucide:trash',
                        label: 'Delete',
                        onClick: handleDelete,
                    },
                ]}
            />
        </div>
    );
};

export const AccountCardSkeleton: FC<{}> = () => {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 text-sm shadow-md">
            <Skeleton>
                <div className="size-6 rounded-full bg-accent xs:size-9"></div>
            </Skeleton>
            <div className="flex flex-1 flex-col gap-0.5">
                <Skeleton>
                    <p className="text-sm xs:text-base">Gopay</p>
                </Skeleton>
                <Skeleton>
                    <div className="flex items-center gap-2 text-xs xs:text-sm">
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
