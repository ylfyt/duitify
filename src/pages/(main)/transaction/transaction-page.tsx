import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { formatDate } from '@/helper/format-date';
import { Link } from 'react-router-dom';
import { Transaction } from '@/types/transaction.type';
import { toast } from 'react-toastify';
import { TransactionGroupCard, TransactionGroupCardSkeleton } from './components/transaction-card';
import { VisibleDetector } from '@/components/visible-detector';
import { TransactionRepo } from '@/repo/transaction-repo';
import { PAGINATION_SIZES } from '@/constants/common';
import { ENV } from '@/constants/env';

interface TransactionPageProps {}

const TransactionPage: FC<TransactionPageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [isFirst, setIsFirst] = useState<boolean>(true);

    const groupedTransactions = useMemo(() => {
        return transactions.reduce(
            (acc, transaction) => {
                const date = formatDate(transaction.occurred_at, { format: 'yyyy-MM-dd' });
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(transaction);
                return acc;
            },
            {} as Record<string, Transaction[]>,
        );
    }, [transactions]);

    useEffect(() => {
        setAppBarCtx({
            revealer: true,
            title: <img className="size-8" src={ENV.BASE_URL + '/icons/icon-192x192.png'} />,
            actions: [
                <Link to="/transaction/create" className="dai-btn dai-btn-success dai-btn-sm ml-2">
                    Create
                </Link>,
            ],
        });
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data, error } = await TransactionRepo.getTransactions({ cursor });
            setLoading(false);
            if (error) {
                setHasMore(false);
                toast.error(error.message);
                return;
            }
            setTransactions([...transactions, ...(data ?? [])]);
            setIsFirst(false);
            setHasMore((data?.length ?? 0) >= PAGINATION_SIZES[0]);
        })();
    }, [cursor]);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <div className="flex flex-col gap-4">
                {loading && isFirst ? (
                    Array.from({ length: 4 }).map((_, idx) => <TransactionGroupCardSkeleton key={idx} />)
                ) : transactions.length === 0 ? (
                    <p className="mt-4 text-center text-xl">No transactions found</p>
                ) : (
                    Object.keys(groupedTransactions)
                        .sort((a, b) => (a > b ? -1 : 1))
                        .map((date, idx) => (
                            <TransactionGroupCard
                                key={idx}
                                date={date}
                                transactions={groupedTransactions[date]}
                                onDeleted={(id) => {
                                    setTransactions((prev) => prev.filter((el) => el.id !== id));
                                }}
                            />
                        ))
                )}
            </div>
            {!isFirst && hasMore && !loading ? (
                <VisibleDetector onVisible={() => setCursor(transactions[transactions.length - 1]?.occurred_at)}>
                    <span className="flex justify-center">
                        <span className="dai-loading dai-loading-dots dai-loading-lg invisible text-primary"></span>
                    </span>
                </VisibleDetector>
            ) : loading && !isFirst ? (
                <span className="flex justify-center">
                    <span className="dai-loading dai-loading-dots dai-loading-lg text-primary"></span>
                </span>
            ) : null}
        </div>
    );
};

export default TransactionPage;
