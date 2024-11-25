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

interface TransactionGroupCardProps {
    date: string;
    transactions: Transaction[];
    onDeleted: (id: string) => void;
}

export const TransactionGroupCard: FC<TransactionGroupCardProps> = ({ date, transactions, onDeleted }) => {
    return (
        <div className="flex flex-col gap-1">
            <div className="border-b-2 border-b-primary">
                <span>{formatDate(date, { lang: 'en-US' })}</span>
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
        onDeleted(el.id);
    };

    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 shadow">
            <img
                className="size-12"
                src={ENV.BASE_URL + (el.type === 'transfer' ? '/categories/transfer.png' : el.category?.logo)}
                alt=""
            />
            <div className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    <span className="text-lg">{el.type === 'transfer' ? 'Transfer' : el.category?.name}</span>
                    <span className="text-sm">{el.description}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1 font-semibold">
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
            <div className="border-b-2 border-b-primary">
                <span>Sep 20, 2022</span>
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
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 shadow">
            <Skeleton>
                <div className="size-12"></div>
            </Skeleton>
            <div className="flex w-full items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    <Skeleton>
                        <span className="text-lg">Food</span>
                    </Skeleton>
                    <Skeleton>
                        <span className="text-sm">Lorem, ipsum.</span>
                    </Skeleton>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1 font-semibold">
                        <Skeleton>
                            <span className={'text-nowrap text-lg'}>{formatCurrency(10_0000)}</span>
                        </Skeleton>
                        <div className="flex items-center gap-1">
                            <div className="flex items-center gap-2 text-xs">
                                <Skeleton>
                                    <div className="size-4"></div>
                                </Skeleton>
                                <Skeleton>
                                    <span>Shopee Pay</span>
                                </Skeleton>
                            </div>
                        </div>
                    </div>
                    <Skeleton>
                        <DropdownMenu options={[]} />
                    </Skeleton>
                </div>
            </div>
        </div>
    );
};

export default TransactionCardSkeleton;
