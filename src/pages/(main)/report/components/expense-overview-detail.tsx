import { Icon } from '@/components/icon';
import Skeleton, { CondSkeleton } from '@/components/skeleton';
import { CATEGORY_LOGO_BASE } from '@/constants/logo';
import { formatCurrency } from '@/helper/format-currency';
import { formatNumeric } from '@/helper/format-numeric';
import { ExpenseOverview } from '@/types/report.type';
import { FC, useMemo } from 'react';

interface ExpenseOverviewDetailProps {
    expenses: ExpenseOverview[];
    loadingExpense: boolean;
    totalExpense: number;
    totalIncome: number;
    loadingIncome: boolean;
    ranges?: { start: Date; end: Date };
}

export const ExpenseOverviewDetail: FC<ExpenseOverviewDetailProps> = ({
    expenses,
    totalExpense,
    totalIncome,
    loadingIncome,
    loadingExpense,
    ranges,
}) => {
    const expenseCount = useMemo(() => expenses.reduce((acc, el) => acc + el.count, 0), [expenses]);
    const days = useMemo(() => {
        if (!ranges) return 0;
        const now = new Date();

        if (ranges.end.getMonth() === now.getMonth() && ranges.end.getFullYear() === now.getFullYear()) {
            return Math.ceil((now.getTime() - ranges.start.getTime()) / (1000 * 60 * 60 * 24));
        }
        return Math.ceil((ranges.end.getTime() - ranges.start.getTime()) / (1000 * 60 * 60 * 24));
    }, [ranges]);

    return (
        <div className="flex w-full flex-col gap-2 text-xs">
            <div className="rounded-lg border bg-base-100">
                <div className="flex border-b px-2 text-base-content-accent">
                    <div className="flex flex-1 flex-col items-center gap-0.5 py-2">
                        <CondSkeleton skel={loadingIncome}>
                            <span>Income </span>
                        </CondSkeleton>
                        <CondSkeleton skel={loadingIncome}>
                            <span className="text-sm text-success">
                                {formatCurrency(loadingIncome ? 10_123_000 : totalIncome)}
                            </span>
                        </CondSkeleton>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-0.5 border-x py-2">
                        <CondSkeleton skel={loadingExpense}>
                            <span>Expense</span>
                        </CondSkeleton>
                        <CondSkeleton skel={loadingExpense}>
                            <span className="text-sm text-error">
                                {formatCurrency(loadingExpense ? 10_123_000 : -1 * totalExpense)}
                            </span>
                        </CondSkeleton>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-0.5 py-2">
                        <CondSkeleton skel={loadingExpense || loadingIncome}>
                            <span>Save</span>
                        </CondSkeleton>
                        <CondSkeleton skel={loadingExpense || loadingIncome}>
                            <span className="text-sm text-success">
                                {formatCurrency(
                                    loadingExpense || loadingIncome ? 10_123_000 : totalIncome - totalExpense,
                                )}
                            </span>{' '}
                        </CondSkeleton>
                    </div>
                </div>
                <div className="flex items-center justify-evenly gap-2 p-2">
                    <CondSkeleton skel={loadingExpense}>
                        <div className="flex items-center gap-1 text-success">
                            <Icon icon="lucide:calendar-days" />
                            <span>{days}</span>
                        </div>
                    </CondSkeleton>
                    <CondSkeleton skel={loadingExpense}>
                        <div className="flex items-center gap-1 text-error">
                            <Icon icon="lucide:upload" />
                            <span>{formatNumeric(loadingExpense ? 1230 : expenseCount)}</span>
                        </div>
                    </CondSkeleton>
                    <CondSkeleton skel={loadingExpense}>
                        <span className="text-error">
                            Avg.{' '}
                            {formatCurrency(
                                loadingExpense ? 10_123_000 : expenseCount === 0 ? 0 : totalExpense / expenseCount,
                            )}
                        </span>
                    </CondSkeleton>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 rounded-lg border bg-base-100 p-2">
                {loadingExpense ? (
                    Array.from({ length: 10 }).map((_, idx) => (
                        <div key={idx} className={'flex flex-col gap-0.5 ' + (idx !== 9 ? 'border-b pb-2' : '')}>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="dai-skeleton size-5 xs:size-6"></div>
                                    <Skeleton>
                                        <span>Transportation</span>
                                    </Skeleton>
                                </div>
                                <Skeleton>
                                    <span className="text-error">{formatCurrency(-1 * 10_123_000)}</span>
                                </Skeleton>
                            </div>
                            <div className="flex items-center text-xxs">
                                <div className="flex flex-1 items-center gap-2">
                                    <Skeleton>
                                        <div className="flex items-center gap-1 text-error">
                                            <Icon icon="lucide:upload" />
                                            <span>{formatNumeric(1000)}</span>
                                        </div>
                                    </Skeleton>
                                    <Skeleton>
                                        <span className="text-error">Avg. {formatCurrency(-1 * 123_000)}</span>
                                    </Skeleton>
                                </div>
                                <div
                                    className="dai-radial-progress dai-skeleton text-transparent"
                                    style={
                                        {
                                            '--value': '70',
                                            '--size': '1.5rem',
                                            '--thickness': '0.1rem',
                                        } as React.CSSProperties
                                    }
                                    aria-valuenow={70}
                                    role="progressbar"
                                >
                                    {70}%
                                </div>
                            </div>
                        </div>
                    ))
                ) : expenses.length === 0 ? (
                    <div className="text-center text-base-content-accent">No expense found</div>
                ) : (
                    expenses.map((el, idx) => {
                        const percent = totalExpense === 0 ? 0 : Math.round((100 * (el.amount ?? 0)) / totalExpense);
                        return (
                            <div
                                key={idx}
                                className={
                                    'flex flex-col gap-0.5 ' + (idx !== expenses.length - 1 ? 'border-b pb-2' : '')
                                }
                            >
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="size-5 xs:size-6">
                                            <img
                                                className="aspect-square w-full"
                                                src={CATEGORY_LOGO_BASE + '/' + el.category?.logo}
                                                loading="lazy"
                                                alt=""
                                            />
                                        </div>
                                        <span>{el.category?.name}</span>
                                    </div>
                                    <span className="text-error">{formatCurrency(-1 * el.amount)}</span>
                                </div>
                                <div className="flex items-center text-xxs">
                                    <div className="flex flex-1 items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Icon icon="lucide:upload" />
                                            <span>{formatNumeric(el.count)}</span>
                                        </div>
                                        <span className="text-error">
                                            Avg. {formatCurrency((-1 * el.amount) / el.count)}
                                        </span>
                                    </div>
                                    <div
                                        className="dai-radial-progress text-primary"
                                        style={
                                            {
                                                '--value': percent,
                                                '--size': '1.5rem',
                                                '--thickness': '0.1rem',
                                            } as React.CSSProperties
                                        }
                                        aria-valuenow={70}
                                        role="progressbar"
                                    >
                                        {percent}%
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
