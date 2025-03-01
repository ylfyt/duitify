import { Icon } from '@/components/icon';
import { formatCurrency } from '@/helper/format-currency';
import { formatDate } from '@/helper/format-date';
import { Transaction } from '@/types/transaction.type';
import { FC, useMemo } from 'react';
import Skeleton from '@/components/skeleton';
import { AmountRevealer } from '@/components/amount-revealer';
import { ACCOUNT_LOGO_BASE, CATEGORY_LOGO_BASE } from '@/constants/logo';

interface TransactionGroupCardProps {
    date: string;
    transactions: Transaction[];
    onDeleted: (id: string) => void;
}

export const TransactionGroupCard: FC<TransactionGroupCardProps> = ({ date, transactions, onDeleted }) => {
    const total = useMemo(
        () =>
            transactions.reduce(
                (acc, el) => acc + (el.type === 'transfer' ? 0 : el.type === 'expense' ? -1 * el.amount : el.amount),
                0,
            ),
        [transactions],
    );

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between border-b border-b-primary">
                <span className="text-xs xs:text-sm">{formatDate(date, { lang: 'en-US' })}</span>
                <span className={'dai-badge dai-badge-xs ' + (total > 0 ? 'dai-badge-success' : 'dai-badge-error')}>
                    <AmountRevealer amount={total} />
                </span>
            </div>
            <div className="flex flex-col gap-1">
                {transactions.map((el, idx) => (
                    <TransactionCard key={idx} el={el} onDeleted={onDeleted} />
                ))}
            </div>
        </div>
    );
};

interface TransactionCardProps {
    el: Transaction;
    onDeleted: (id: string) => void;
}

const TransactionCard: FC<TransactionCardProps> = ({ el }) => {
    const amount = useMemo(() => (el.type === 'expense' ? -1 * el.amount : el.amount), [el]);

    return (
        <div className="flex flex-col gap-1.5 rounded bg-base-100 px-2 py-1.5 shadow">
            <div className="flex items-center gap-1.5">
                <div className="size-4 xs:size-5">
                    <img
                        className="aspect-square w-full"
                        src={CATEGORY_LOGO_BASE + '/' + (el.type === 'transfer' ? `transfer.webp` : el.category?.logo)}
                        loading="lazy"
                        alt=""
                    />
                </div>
                <div className="grid flex-1 grid-cols-6 text-xs font-medium xs:text-sm">
                    <span className="col-span-2">{el.type === 'transfer' ? 'Transfer' : el.category?.name}</span>
                    <div className="col-span-3 flex flex-wrap items-center gap-0.5">
                        <div className="flex items-center gap-1 text-xs">
                            <div className="size-3 xs:size-4">
                                <img
                                    className="aspect-square w-full"
                                    loading="lazy"
                                    src={ACCOUNT_LOGO_BASE + '/' + el.account?.logo}
                                    alt=""
                                />
                            </div>
                            <span>{el.account?.name}</span>
                        </div>
                        {el.type === 'transfer' && el.to_account && (
                            <>
                                <Icon className="text-[8px] text-base-content" icon="lucide:arrow-right" />
                                <div className="flex items-center gap-1 text-xs">
                                    <div className="size-3 xs:size-4">
                                        <img
                                            loading="lazy"
                                            className="aspect-square w-full"
                                            src={ACCOUNT_LOGO_BASE + '/' + el.to_account?.logo}
                                            alt=""
                                        />
                                    </div>
                                    <span>{el.to_account?.name}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <span
                        className={
                            'text-nowrap text-end ' +
                            (el.type === 'transfer' ? 'text-secondary' : amount > 0 ? 'text-success' : 'text-error')
                        }
                    >
                        <AmountRevealer amount={amount} />
                    </span>
                </div>
            </div>
            {el.description && (
                <span className="line-clamp-1 text-end text-xs text-base-content/80">{el.description}</span>
            )}
        </div>
    );
};

export const TransactionGroupCardSkeleton: FC<{}> = () => {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between border-b border-b-primary">
                <span className="text-xs xs:text-sm">
                    <Skeleton>Wed, Sep 20, 2022</Skeleton>
                </span>

                <span className="dai-badge dai-badge-error dai-skeleton dai-badge-xs text-transparent">
                    {formatCurrency(10_000)}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <TransactionCardSkeleton key={idx} />
                ))}
            </div>
        </div>
    );
};

const TransactionCardSkeleton: FC<{}> = () => {
    return (
        <div className="flex flex-col gap-1.5 rounded bg-base-100 px-2 py-1.5 shadow">
            <div className="flex items-center gap-1.5">
                <Skeleton>
                    <div className="size-4 xs:size-5"></div>
                </Skeleton>
                <div className="grid flex-1 grid-cols-6 text-xs font-medium xs:text-sm">
                    <span className="col-span-2">
                        <Skeleton>Transfer</Skeleton>
                    </span>
                    <div className="col-span-3 flex flex-wrap items-center gap-0.5">
                        <div className="flex items-center gap-1 text-xs">
                            <Skeleton>
                                <div className="size-3 xs:size-4"></div>
                            </Skeleton>
                            <span>
                                <Skeleton>Shopee Pay</Skeleton>
                            </span>
                        </div>
                    </div>
                    <span className={'text-nowrap text-end'}>
                        <Skeleton>24.320</Skeleton>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TransactionCardSkeleton;
