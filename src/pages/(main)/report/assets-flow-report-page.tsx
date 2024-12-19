import { AmountRevealer } from '@/components/amount-revealer';
import { DropdownMenu } from '@/components/dropdown-menu';
import { Icon } from '@/components/icon';
import Skeleton from '@/components/skeleton';
import { formatCurrency } from '@/helper/format-currency';
import { formatNumeric } from '@/helper/format-numeric';
import { QueryResultOne } from '@/repo/base-repo';
import { ReportRepo } from '@/repo/report-repo';
import { sessionAtom } from '@/stores/auth';
import { settingsAtom } from '@/stores/settings';
import { colorSchemeAtom } from '@/stores/theme';
import { TransactionFlow } from '@/types/report.type';
import {
    CategoryScale,
    Chart,
    ChartData,
    LinearScale,
    LineElement,
    LogarithmicScale,
    Point,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { getDefaultStore, useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, LogarithmicScale);

const store = getDefaultStore();
const formarterDay = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
});

const formarterMonth = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
});

const getNowDate = () => {
    const settings = store.get(settingsAtom);
    const now = new Date();
    if (!settings?.month_end_date || now.getDate() <= settings.month_end_date) return now;
    now.setMonth(now.getMonth() + 1);

    return now;
};

interface AssetsFlowReportPageProps {}

const AssetsFlowReportPage: FC<AssetsFlowReportPageProps> = () => {
    const [session] = useAtom(sessionAtom);
    const [colorScheme] = useAtom(colorSchemeAtom);
    const [settings] = useAtom(settingsAtom);

    const [flowDate, setFlowDate] = useState<Date | undefined>(getNowDate());
    const [isEveryDay, setIsEveryDay] = useState(true);

    const [loadingExpense, setLoadingExpense] = useState(false);
    const [expenseData, setExpenseData] = useState<TransactionFlow>([]);

    const [loadingInitialBalance, setLoadingInitialBalance] = useState(false);
    const [initialBalance, setInitialBalance] = useState<number | null>(null);

    const loading = useMemo(() => loadingExpense || loadingInitialBalance, [loadingExpense, loadingInitialBalance]);

    const flowData = useMemo<TransactionFlow>(() => {
        if (!initialBalance) return [];
        let balance = initialBalance;
        return expenseData.map((el) => {
            balance += el.amount;
            return {
                ...el,
                amount: balance,
            };
        });
    }, [expenseData, initialBalance]);

    const lastBalance = useMemo<number | undefined>(() => {
        if (loadingExpense) return;
        if (initialBalance == null) return;
        if (flowData.length === 0) return initialBalance;
        return flowData[flowData.length - 1].amount;
    }, [flowData, initialBalance, loadingExpense]);

    const labels = useMemo(
        () => [...new Set([...flowData.map((el) => parseInt(el.occurred_at.split('-').join('')))])],
        [flowData],
    );

    const chart = useMemo<ChartData<'line', (number | Point | null)[], number>>(() => {
        return {
            labels: labels,
            datasets: [
                {
                    label: 'Expense Flow',
                    fill: false,
                    tension: 0.2,
                    borderColor: colorScheme.error,
                    data: flowData.map<Point>((el) => ({
                        y: el.amount,
                        x: parseInt(el.occurred_at.split('-').join('')),
                    })),
                    pointHitRadius: 10,
                },
            ],
        };
    }, [flowData, colorScheme, labels]);

    useEffect(() => {
        (async () => {
            const lastDate = !flowDate
                ? new Date(1970, 0, 2)
                : !isEveryDay
                  ? new Date(flowDate.getFullYear(), 0, 0)
                  : new Date(
                        flowDate.getFullYear(),
                        !settings?.month_end_date ? flowDate.getMonth() : flowDate.getMonth() - 1,
                        !settings?.month_end_date ? 0 : settings.month_end_date,
                    );

            setLoadingInitialBalance(true);
            const res = await ReportRepo.getCurrentBalanceAt({
                userId: session?.user.id ?? '',
                lastDate,
            });
            setLoadingInitialBalance(false);
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setInitialBalance(res.data ?? null);
        })();
    }, [flowDate]);

    useEffect(() => {
        (async () => {
            setLoadingExpense(true);
            let res: QueryResultOne<TransactionFlow>;
            if (isEveryDay)
                res = await ReportRepo.getCashFlowEveryDay({
                    trx_type: ['expense', 'income'],
                    userId: session?.user.id ?? '',
                    month: flowDate ?? new Date(),
                    categories: [],
                });
            else
                res = await ReportRepo.getCashFlowEveryMonth({
                    trx_type: ['expense', 'income'],
                    userId: session?.user.id ?? '',
                    year: flowDate?.getFullYear() ?? new Date().getFullYear(),
                    categories: [],
                });
            setLoadingExpense(false);
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setExpenseData(res.data ?? []);
        })();
    }, [session, flowDate]);

    return (
        <div className="flex flex-1 flex-col items-center gap-2 overflow-x-auto p-2">
            <div className="flex w-full flex-col items-center gap-2 rounded-xl bg-base-100 p-2">
                <div className="flex w-full items-center">
                    <div className="flex flex-1 items-center pl-2">
                        {loading && <span className="dai-loading dai-loading-sm bg-primary"></span>}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            disabled={loading || !flowDate}
                            onClick={() =>
                                setFlowDate((prev) =>
                                    !prev
                                        ? undefined
                                        : new Date(
                                              !isEveryDay
                                                  ? prev.setFullYear(prev.getFullYear() - 1)
                                                  : prev.setMonth(prev.getMonth() - 1),
                                          ),
                                )
                            }
                            className="text-lg disabled:opacity-20"
                        >
                            <Icon icon="lucide:chevron-left" />
                        </button>
                        <span className="w-[8rem] text-center">
                            {!flowDate
                                ? 'All time'
                                : !isEveryDay
                                  ? formarterMonth.format(flowDate)
                                  : formarterDay.format(flowDate)}
                        </span>
                        <button
                            disabled={
                                loading ||
                                !flowDate ||
                                (!isEveryDay && flowDate.getFullYear() === new Date().getFullYear()) ||
                                (isEveryDay && flowDate.getMonth() === getNowDate().getMonth())
                            }
                            onClick={() =>
                                setFlowDate((prev) =>
                                    !prev
                                        ? undefined
                                        : new Date(
                                              !isEveryDay
                                                  ? prev.setFullYear(prev.getFullYear() + 1)
                                                  : prev.setMonth(prev.getMonth() + 1),
                                          ),
                                )
                            }
                            className="text-lg disabled:opacity-20"
                        >
                            <Icon icon="lucide:chevron-right" />
                        </button>
                    </div>
                    <div className="flex flex-1 justify-end">
                        <DropdownMenu
                            disabled={loading}
                            options={[
                                {
                                    icon: 'lucide:calendar-days',
                                    label: isEveryDay ? 'Every Month' : 'Every Day',
                                    onClick: () => {
                                        setFlowDate(getNowDate());
                                        setIsEveryDay((prev) => !prev);
                                    },
                                },
                                {
                                    icon: 'lucide:infinity',
                                    label: flowDate ? 'All time' : !isEveryDay ? 'This year' : 'This month',
                                    onClick: () => setFlowDate((prev) => (prev ? undefined : getNowDate())),
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full space-y-1 rounded-xl bg-base-100 p-4 text-sm">
                <div className="flex items-center justify-between gap-2">
                    <span>{loadingInitialBalance ? <Skeleton>Start Balance:</Skeleton> : 'Start Balance:'}</span>
                    <span
                        className={
                            'font-semibold ' +
                            (!initialBalance ? '' : initialBalance < 0 ? 'text-error' : 'text-success')
                        }
                    >
                        {loadingInitialBalance ? (
                            <Skeleton>{formatCurrency(10_000_000)}</Skeleton>
                        ) : (
                            <AmountRevealer amount={initialBalance ?? 0} />
                        )}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span>{lastBalance == null ? <Skeleton>Last Balance:</Skeleton> : 'Last Balance:'}</span>
                    <span
                        className={
                            'font-semibold ' + (!lastBalance ? '' : lastBalance < 0 ? 'text-error' : 'text-success')
                        }
                    >
                        {lastBalance == null ? (
                            <Skeleton>{formatCurrency(10_000_000)}</Skeleton>
                        ) : (
                            <AmountRevealer amount={lastBalance} />
                        )}
                    </span>
                </div>
            </div>
            <div className="w-full rounded-xl bg-base-100 p-4">
                <Line
                    data={chart}
                    className="h-56"
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                type: 'linear',
                                ticks: {
                                    color: colorScheme['base-content'],
                                    callback: (value) => {
                                        if (typeof value === 'string') return value;
                                        const absValue = Math.abs(value);
                                        return (
                                            formatNumeric(value / (absValue >= 1000 ? 1000 : 1)) +
                                            (absValue >= 1000 ? 'K' : '')
                                        );
                                    },
                                },
                            },
                            x: {
                                ticks: {
                                    color: colorScheme['base-content'],
                                    callback: (value, idx) => {
                                        if (typeof value === 'string') return value;
                                        return labels[idx] % 100;
                                    },
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default AssetsFlowReportPage;
