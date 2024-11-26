import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo } from 'react';
import { Icon } from '@/components/icon';
import { handleLogout } from '@/helper/logout';
import { isDarkAtom } from '@/stores/theme';
import { formatDate } from '@/helper/format-date';
import { Link } from 'react-router-dom';
import { Transaction } from '@/types/transaction.type';
import { toast } from 'react-toastify';
import { TransactionGroupCard, TransactionGroupCardSkeleton } from './components/transaction-card';
import { VisibleDetector } from '@/components/visible-detector';
import { useTransactionAtom } from '@/stores/transaction';

interface TransactionPageProps {}

const TransactionPage: FC<TransactionPageProps> = () => {
    const [isDark, setIsDark] = useAtom(isDarkAtom);
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    const { data: transactions, load, isFirst, hasMore, loading, setData: setTransactions } = useTransactionAtom();

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
            title: undefined,
            leftActions: [
                <button className="dai-btn dai-btn-error dai-btn-sm text-lg" onClick={handleLogout}>
                    <Icon icon="lucide:log-out" />
                </button>,
                <button className="mr-1 p-1 text-xl text-yellow-400" onClick={() => setIsDark(!isDark)}>
                    {isDark ? <Icon icon="lucide:sun" /> : <Icon icon="lucide:moon" />}
                </button>,
            ],
            actions: [
                <Link to="/transaction/create" className="dai-btn dai-btn-success dai-btn-sm ml-4">
                    Create
                </Link>,
            ],
        });
    }, [isDark]);

    useEffect(() => {
        if (!isFirst) return;
        (async () => {
            const msg = await load();
            if (msg) toast.error(msg);
        })();
    }, [isFirst]);

    const loadTransactions = async () => {
        const msg = await load();
        if (msg) toast.error(msg);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <div className="flex flex-col gap-4">
                {loading && isFirst ? (
                    Array.from({ length: 2 }).map((_, idx) => <TransactionGroupCardSkeleton key={idx} />)
                ) : transactions.length === 0 ? (
                    <p>No transactions found</p>
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
                <VisibleDetector onVisible={loadTransactions}>
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
