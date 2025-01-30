import { ReportRepo } from '@/repo/report-repo';
import { ChartData } from 'chart.js';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Chart as ChartJS, Title, Tooltip, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '@/helper/format-currency';
import { COLOR_RANKS } from '@/constants/color-ranks';
import Skeleton from '@/components/skeleton';
import { AmountRevealer } from '@/components/amount-revealer';
import { Icon } from '@/components/icon';
import { ExpenseOverview } from '@/types/report.type';
import { DropdownMenu } from '@/components/dropdown-menu';
import { getDefaultStore, useAtom } from 'jotai';
import { settingsAtom } from '@/stores/settings';
import { sessionAtom } from '@/stores/auth';
import { CATEGORY_LOGO_BASE } from '@/constants/logo';

ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, LinearScale);

const store = getDefaultStore();
const formarter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
});

const getNowDate = () => {
    const settings = store.get(settingsAtom);
    const now = new Date();
    if (!settings?.month_end_date || now.getDate() <= settings.month_end_date) return now;

    now.setDate(1);
    now.setMonth(now.getMonth() + 1);
    return now;
};

interface ReportPageProps {}

const ReportPage: FC<ReportPageProps> = () => {
    const [session] = useAtom(sessionAtom);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ExpenseOverview[]>([]);
    const [loadingIncome, setLoadingIncome] = useState(false);
    const [totalIncome, setTotalIncome] = useState(0);

    const [expenseDate, setExpenseDate] = useState<Date | undefined>(getNowDate);

    const total = useMemo(() => data.reduce((acc, el) => acc + (el.amount ?? 0), 0), [data]);

    const colors = useMemo(() => data.map((_, idx) => COLOR_RANKS[idx] ?? COLOR_RANKS[COLOR_RANKS.length - 1]), [data]);
    const chartData = useMemo<ChartData<'doughnut', number[], string>>(
        () => ({
            labels: data.map((el) => el.category?.name ?? 'unknown'),
            datasets: [
                {
                    data: data.map((el) => el.amount ?? 0),
                    backgroundColor: colors,
                    borderWidth: 1,
                },
            ],
        }),
        [data, colors],
    );

    useEffect(() => {
        if (!session?.user.id) return;
        (async () => {
            setLoading(true);
            const res = await ReportRepo.getExpenseOverview(session.user.id, expenseDate);
            setLoading(false);
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setData(res.data ?? []);
        })();
    }, [expenseDate, session]);

    useEffect(() => {
        if (!session?.user.id) return;
        (async () => {
            setLoadingIncome(true);
            const res = await ReportRepo.getIncomeTotal(session.user.id, expenseDate);
            setLoadingIncome(false);
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setTotalIncome(res.data ?? 0);
        })();
    }, [expenseDate, session]);

    return (
        <div className="flex flex-1 flex-col items-center gap-4 p-2">
            <div className="flex w-full items-center rounded-xl bg-base-100 p-2">
                <div className="flex-1"></div>
                <div className="flex items-center justify-center gap-2">
                    <button
                        disabled={loading || !expenseDate}
                        onClick={() =>
                            setExpenseDate((prev) => (!prev ? undefined : new Date(prev.setMonth(prev.getMonth() - 1))))
                        }
                        className="text-xl disabled:opacity-20"
                    >
                        <Icon icon="lucide:chevron-left" />
                    </button>
                    <span className="w-[10rem] text-center">
                        {!expenseDate ? 'All time' : formarter.format(expenseDate)}
                    </span>
                    <button
                        disabled={loading || !expenseDate || expenseDate.getMonth() === getNowDate().getMonth()}
                        onClick={() =>
                            setExpenseDate((prev) => (!prev ? undefined : new Date(prev.setMonth(prev.getMonth() + 1))))
                        }
                        className="text-xl disabled:opacity-20"
                    >
                        <Icon icon="lucide:chevron-right" />
                    </button>
                </div>
                <div className="flex flex-1 justify-end">
                    <DropdownMenu
                        options={[
                            {
                                icon: 'lucide:calendar-days',
                                label: expenseDate ? 'All time' : 'This month',
                                onClick: () => setExpenseDate((prev) => (prev ? undefined : getNowDate())),
                            },
                        ]}
                    />
                </div>
            </div>
            <div className="aspect-square w-[60vw] max-w-[20rem]">
                {loading ? (
                    <Skeleton className="h-full w-full rounded-full">
                        <div></div>
                    </Skeleton>
                ) : data.length === 0 ? (
                    <div className="h-full w-full rounded-full bg-base-300"></div>
                ) : (
                    <Doughnut
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function (tooltipItem) {
                                            return `${tooltipItem.label}: ${formatCurrency(parseFloat(tooltipItem.raw as string))}`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                )}
            </div>
            <div
                className={
                    'flex w-full items-center justify-evenly gap-2 rounded-xl px-3 py-2 text-xs font-medium ' +
                    (loading || loadingIncome ? 'dai-skeleton' : 'bg-base-100')
                }
            >
                <span className={loading ? 'text-transparent' : 'text-error'}>
                    <AmountRevealer count={6} amount={loading ? -1000_000 : -1 * total} />
                </span>
                <div className="h-full w-[1px] bg-base-300"></div>
                <span className={loadingIncome ? 'text-transparent' : 'text-success'}>
                    <AmountRevealer count={6} amount={loadingIncome ? 1000_000 : totalIncome} />
                </span>
                <div className="h-full w-[1px] bg-base-300"></div>
                <span
                    className={
                        loading || loadingIncome
                            ? 'text-transparent'
                            : total > totalIncome
                              ? 'text-error'
                              : 'text-success'
                    }
                >
                    <AmountRevealer count={6} amount={loading || loadingIncome ? 1000_000 : totalIncome - total} />
                </span>
            </div>
            <div className="grid w-full grid-cols-1 gap-1 md:grid-cols-2">
                {loading
                    ? Array.from({ length: 14 }).map((_, idx) => <ReportExpenseCardSkeleton key={idx} />)
                    : data.length === 0
                      ? null
                      : data.map((el, idx) => (
                            <ReportExpenseCard
                                key={idx}
                                el={el}
                                total={total}
                                color={colors[idx] ?? colors[colors.length - 1]}
                            />
                        ))}
            </div>
        </div>
    );
};

export default ReportPage;

interface ReportExpenseCardProps {
    el: ExpenseOverview;
    total: number;
    color: string;
}

const ReportExpenseCard: FC<ReportExpenseCardProps> = ({ el, total, color }) => {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 shadow">
            <img className="size-9 xs:size-12" src={CATEGORY_LOGO_BASE + '/' + el.category?.logo} alt="" />
            <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between text-sm xs:text-base">
                    <div className="flex items-center gap-1.5">
                        <span style={{ backgroundColor: color }} className="h-2 w-4"></span>
                        <span>{el.category?.name}</span>
                    </div>
                    <span className="font-medium text-error">
                        <AmountRevealer amount={-1 * (el.amount ?? 0)} />
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <progress
                        className="dai-progress dai-progress-primary"
                        value={el.amount ?? 0}
                        max={total}
                    ></progress>
                    <span className="text-xs sm:text-sm">
                        {Math.round(100 * (total === 0 ? 0 : (el.amount ?? 0) / total))}%
                    </span>
                </div>
            </div>
        </div>
    );
};

interface ReportExpenseCardSkeletonProps {}

const ReportExpenseCardSkeleton: FC<ReportExpenseCardSkeletonProps> = () => {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 shadow">
            <Skeleton>
                <div className="size-9 xs:size-12"></div>
            </Skeleton>
            <div className="flex flex-1 flex-col gap-1">
                <div className="flex justify-between text-sm xs:text-base">
                    <div className="flex items-center gap-1.5">
                        <Skeleton>
                            <div className="h-2 w-[1rem]"></div>
                        </Skeleton>
                        <Skeleton>
                            <span>Transportation</span>
                        </Skeleton>
                    </div>
                    <Skeleton>
                        <span className="font-medium text-error">{formatCurrency(-1 * 10_000)}</span>
                    </Skeleton>
                </div>
                <div className="flex items-center gap-2">
                    <progress className="dai-progress dai-progress-primary dai-skeleton" value={0} max={0}></progress>
                    <span className="text-xs sm:text-sm">
                        <Skeleton>28%</Skeleton>
                    </span>
                </div>
            </div>
        </div>
    );
};
