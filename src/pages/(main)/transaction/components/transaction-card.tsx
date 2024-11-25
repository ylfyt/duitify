import { DropdownMenu } from '@/components/dropdown-menu';
import { Icon } from '@/components/icon';
import { ENV } from '@/constants/env';
import { formatCurrency } from '@/helper/format-currency';
import { formatDate } from '@/helper/format-date';
import { Transaction } from '@/types/transaction.type';
import { FC, useMemo } from 'react';

interface TransactionGroupCardProps {
    date: string;
    transactions: Transaction[];
}

export const TransactionGroupCard: FC<TransactionGroupCardProps> = ({ date, transactions }) => {
    return (
        <div className="flex flex-col gap-1">
            <div className="border-b-2 border-b-primary">
                <span>{formatDate(date, { lang: 'en-US' })}</span>
            </div>
            <div className="flex flex-col gap-1">
                {transactions.map((el, idx) => (
                    <TransactionCard key={idx} el={el} />
                ))}
            </div>
        </div>
    );
};

interface TransactionCardProps {
    el: Transaction;
}

const TransactionCard: FC<TransactionCardProps> = ({ el }) => {
    const amount = useMemo(() => (el.type === 'expense' ? -1 * el.amount : el.amount), [el]);

    return (
        <div className="flex items-center gap-4">
            <img
                className="size-12"
                src={ENV.BASE_URL + (el.type === 'transfer' ? '/categories/transfer.png' : el.category?.logo)}
                alt=""
            />
            <div className="flex w-full items-center justify-between gap-4 border-b border-b-primary/30 py-2">
                <div className="flex flex-col gap-0.5">
                    <span className="text-lg">{el.type === 'transfer' ? 'Transfer' : el.category?.name}</span>
                    <span className="text-sm">{el.description}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-2 font-semibold">
                        <span
                            className={
                                'text-nowrap text-lg ' +
                                (el.type === 'transfer' ? 'text-primary' : amount > 0 ? 'text-success' : 'text-error')
                            }
                        >
                            {formatCurrency(amount)}
                        </span>
                        <div className="flex items-center gap-1">
                            <div className="flex items-center gap-2 text-xs">
                                <img className="size-4" src={ENV.BASE_URL + el.account?.logo} alt="" />
                                <span>{el.account?.name}</span>
                            </div>
                            {el.type === 'transfer' && el.to_account && (
                                <>
                                    <span>
                                        <Icon className="text-sm" icon="lucide:arrow-right" />
                                    </span>
                                    <div className="flex items-center gap-2 text-xs">
                                        <img className="size-4" src={ENV.BASE_URL + el.to_account?.logo} alt="" />
                                        <span>{el.to_account?.name}</span>
                                    </div>
                                </>
                            )}
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
            </div>
        </div>
    );
};

export default TransactionCard;
