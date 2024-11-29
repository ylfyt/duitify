import { DropdownMenu } from '@/components/dropdown-menu';
import { Icon } from '@/components/icon';
import { ENV } from '@/constants/env';
import { formatCurrency } from '@/helper/format-currency';
import { formatDate } from '@/helper/format-date';
import { TransactionRepo } from '@/repo/transaction-repo';
import { showLoading } from '@/stores/common';
import { showConfirm } from '@/stores/confirm';
import { Transaction } from '@/types/transaction.type';
import { useAtom } from 'jotai';
import { FC, useMemo } from 'react';
import { toast } from 'react-toastify';
import { focusedTransactionAtom } from '../_layout';
import { useNavigate } from 'react-router-dom';
import Skeleton from '@/components/skeleton';
import { useAccountAtom } from '@/stores/account';

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
            <div className="flex items-center justify-between border-b-2 border-b-primary">
                <span className="xs:text-base text-sm">{formatDate(date, { lang: 'en-US' })}</span>
                <span className={'dai-badge dai-badge-sm ' + (total > 0 ? 'dai-badge-success' : 'dai-badge-error')}>
                    {formatCurrency(total)}
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

const TransactionCard: FC<TransactionCardProps> = ({ el, onDeleted }) => {
    const [, setFocusedTransaction] = useAtom(focusedTransactionAtom);
    const navigate = useNavigate();
    const { setData } = useAccountAtom();

    const amount = useMemo(() => (el.type === 'expense' ? -1 * el.amount : el.amount), [el]);

    const handleDelete = async () => {
        const confirmed = await showConfirm({
            title: 'Delete transaction',
            body: 'Are you sure you want to delete this transaction?',
        });
        if (!confirmed) return;

        showLoading(true);
        const { error } = await TransactionRepo.delete(el.id);
        showLoading(false);
        if (error) {
            toast.error(error.message);
            return;
        }
        setData((prev) => {
            const account = prev.find((el2) => el2.id === el.account_id);
            if (!account) return prev;
            if (el.type === 'expense' || el.type === 'transfer') {
                account.balance += el.amount;
            }
            if (el.type === 'income') {
                account.balance -= el.amount;
            }
            if (el.type === 'transfer') {
                const toAccount = prev.find((el2) => el2.id === el.to_account_id);
                if (!toAccount) return prev;
                toAccount.balance -= el.amount;
            }
            return [...prev];
        });
        onDeleted(el.id);
    };

    return (
        <div className="flex items-center gap-3 rounded-xl bg-base-100 px-3 py-2 shadow">
            <img
                className="xs:size-12 size-9"
                src={ENV.BASE_URL + (el.type === 'transfer' ? '/categories/transfer.webp' : el.category?.logo)}
                loading="lazy"
                alt=""
            />
            <div className="flex w-full items-center justify-between">
                <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="xs:text-base text-sm font-medium">
                            {el.type === 'transfer' ? 'Transfer' : el.category?.name}
                        </span>
                        <span
                            className={
                                'xs:text-base text-nowrap text-sm font-medium ' +
                                (el.type === 'transfer' ? 'text-primary' : amount > 0 ? 'text-success' : 'text-error')
                            }
                        >
                            {formatCurrency(amount)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-0.5">
                            <div className="flex items-center gap-1 text-xs">
                                <img
                                    loading="lazy"
                                    className="xs:size-4 size-3"
                                    src={ENV.BASE_URL + el.account?.logo}
                                    alt=""
                                />
                                <span>{el.account?.name}</span>
                            </div>
                            {el.type === 'transfer' && el.to_account && (
                                <>
                                    <span>
                                        <Icon className="text-xs" icon="lucide:arrow-right" />
                                    </span>
                                    <div className="flex items-center gap-1 text-xs">
                                        <img
                                            loading="lazy"
                                            className="xs:size-4 size-3"
                                            src={ENV.BASE_URL + el.to_account?.logo}
                                            alt=""
                                        />
                                        <span>{el.to_account?.name}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <span className="line-clamp-1 text-xs">{el.description}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu
                        options={[
                            {
                                icon: 'lucide:pencil',
                                label: 'Edit',
                                onClick: () => {
                                    setFocusedTransaction(el);
                                    navigate(`/transaction/create`);
                                },
                            },
                            {
                                icon: 'lucide:trash',
                                label: 'Delete',
                                onClick: handleDelete,
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

interface TransactionGroupCardSkeletonProps {}

export const TransactionGroupCardSkeleton: FC<TransactionGroupCardSkeletonProps> = () => {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between border-b-2 border-b-primary">
                <Skeleton>
                    <span className="xs:text-base text-sm">Wed, Sep 20, 2022</span>
                </Skeleton>
                <Skeleton>
                    <span className="dai-badge dai-badge-error dai-badge-sm">{formatCurrency(10_000)}</span>
                </Skeleton>
            </div>
            <div className="flex flex-col gap-1">
                {Array.from({ length: 3 }).map((_, idx) => (
                    <TransactionCardSkeleton key={idx} />
                ))}
            </div>
        </div>
    );
};

interface TransactionCardSkeletonProps {}

const TransactionCardSkeleton: FC<TransactionCardSkeletonProps> = () => {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-base-100 px-3 py-2 shadow">
            <Skeleton>
                <div className="xs:size-12 size-9"></div>
            </Skeleton>
            <div className="flex w-full items-center justify-between">
                <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Skeleton>
                            <span className="xs:text-base text-sm font-medium">Transportation</span>
                        </Skeleton>
                        <Skeleton>
                            <span className="xs:text-base text-nowrap text-sm font-medium">
                                {formatCurrency(100_000)}
                            </span>
                        </Skeleton>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-0.5">
                            <div className="flex items-center gap-1 text-xs">
                                <Skeleton>
                                    <div className="xs:size-4 size-3"></div>
                                </Skeleton>
                                <Skeleton>
                                    <span>Shopee Pay</span>
                                </Skeleton>
                            </div>
                        </div>
                        <Skeleton>
                            <span className="line-clamp-1 text-xs">Lorem, ipsum.</span>
                        </Skeleton>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton>
                        <DropdownMenu options={[]} />
                    </Skeleton>
                </div>
            </div>
        </div>
    );
};

export default TransactionCardSkeleton;
