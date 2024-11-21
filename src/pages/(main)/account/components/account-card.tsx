import { DropdownMenu } from '@/components/dropdown-menu';
import Skeleton from '@/components/skeleton';
import { formatCurrency } from '@/helper/format-currency';
import { Account } from '@/types/account.type';
import { FC } from 'react';

interface AccountCardProps {
    account: Account;
}

export const AccountCard: FC<AccountCardProps> = ({ account }) => {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 p-5 text-sm shadow-md">
            <div className="size-12 rounded-full bg-accent"></div>
            <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-lg">{account.name}</p>
                <div className="flex items-center gap-2">
                    <p>Balance: </p>
                    <p className={'font-bold ' + (account.balance < 0 ? 'text-error' : 'text-success')}>
                        {formatCurrency(account.balance)}
                    </p>
                </div>
            </div>
            <DropdownMenu
                options={[
                    {
                        icon: 'lucide:pencil',
                        label: 'Edit',
                        onClick: () => {},
                    },
                ]}
            />
        </div>
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
                <DropdownMenu
                    options={[
                        {
                            icon: 'lucide:pencil',
                            label: 'Edit',
                            onClick: () => {},
                        },
                    ]}
                />
            </Skeleton>
        </div>
    );
};
