import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { formatDate } from '@/helper/format-date';
import { Link, useSearchParams } from 'react-router-dom';
import { Transaction } from '@/types/transaction.type';
import { toast } from 'react-toastify';
import { TransactionGroupCard, TransactionGroupCardSkeleton } from './components/transaction-card';
import { VisibleDetector } from '@/components/visible-detector';
import { TransactionRepo } from '@/repo/transaction-repo';
import { PAGINATION_SIZES } from '@/constants/common';
import { ENV } from '@/constants/env';
import { sessionAtom } from '@/stores/auth';

interface TransactionPageProps {}

const TransactionPage: FC<TransactionPageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);
    const [session] = useAtom(sessionAtom);

    const [search] = useSearchParams();

    const [account, setAccount] = useState<string | null>(search.get('account'));
    const [category, setCategory] = useState<string | null>(search.get('category'));

    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [isFirst, setIsFirst] = useState<boolean>(true);

    const selectedAccount = useMemo(
        () => (!account ? null : transactions.find((t) => t.account_id === account)?.account),
        [account, transactions],
    );

    const selectedCategory = useMemo(
        () => (!category ? null : transactions.find((t) => t.category_id === category)?.category),
        [category, transactions],
    );

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
        setIsFirst(true);
        setHasMore(false);
        setTransactions([]);
        setCursor(undefined);
        setAccount(search.get('account'));
        setCategory(search.get('category'));
    }, [search]);

    useEffect(() => {
        setAppBarCtx({
            revealer: true,
            back: !!selectedAccount || !!selectedCategory,
            title: (selectedAccount || selectedCategory)?.name ?? (
                <img className="size-8" src={ENV.BASE_URL + '/icons/icon-192x192.png'} />
            ),
            actions: [
                <Link
                    to={`/transaction/create?${search.toString()}`}
                    className="dai-btn dai-btn-success dai-btn-xs ml-2 xs:dai-btn-sm"
                >
                    Create
                </Link>,
            ],
        });
    }, [selectedAccount, selectedCategory]);

    useEffect(() => {
        if (!session?.user.id) return;
        (async () => {
            setLoading(true);
            const { data, error } = await TransactionRepo.getTransactions(session.user.id, {
                cursor,
                account,
                category,
            });
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
    }, [cursor, account, session, category]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-2">
            <div className="flex flex-col gap-4">
                {loading && isFirst ? (
                    Array.from({ length: 4 }).map((_, idx) => <TransactionGroupCardSkeleton key={idx} />)
                ) : transactions.length === 0 ? (
                    <p className="text-center text-xl">No transactions found</p>
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
                    <span className="invisible flex justify-center">
                        <span className="dai-loading dai-loading-dots dai-loading-sm text-primary"></span>
                    </span>
                </VisibleDetector>
            ) : (
                <span className={'flex justify-center ' + (loading && !isFirst ? 'visible' : 'invisible')}>
                    <span className="dai-loading dai-loading-dots dai-loading-sm text-primary"></span>
                </span>
            )}
        </div>
    );
};

export default TransactionPage;
