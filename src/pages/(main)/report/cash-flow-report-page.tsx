import { DropdownMenu } from '@/components/dropdown-menu';
import { Icon } from '@/components/icon';
import { formatNumeric } from '@/helper/format-numeric';
import { QueryResultOne } from '@/repo/base-repo';
import { ReportRepo } from '@/repo/report-repo';
import { sessionAtom } from '@/stores/auth';
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
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, LogarithmicScale);

const formarterDay = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
});

const formarterMonth = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
});

interface CashFlowReportPageProps {}

const CashFlowReportPage: FC<CashFlowReportPageProps> = () => {
    const [session] = useAtom(sessionAtom);
    const [colorScheme] = useAtom(colorSchemeAtom);

    const [flowDate, setFlowDate] = useState<Date | undefined>(new Date());
    const [flowScale, setFlowScale] = useState<'everyday' | 'everymonth'>('everyday');
    const [showExpense, setShowExpense] = useState(true);
    const [showIncome, setShowIncome] = useState(false);

    const [loadingExpense, setLoadingExpense] = useState(false);
    const [loadingIncome, setLoadingIncome] = useState(false);
    const [expenseData, setExpenseData] = useState<TransactionFlow>([]);
    const [incomeData, setIncomeData] = useState<TransactionFlow>([]);

    const loading = useMemo(() => loadingExpense || loadingIncome, [loadingExpense, loadingIncome]);
    const expenseChart = useMemo<ChartData<'line', (number | Point | null)[], string>>(() => {
        const labels = expenseData.map((el) => el.occurred_at);
        labels.push(...incomeData.map((el) => el.occurred_at));
        const unique = [...new Set(labels)];

        return {
            labels: unique.map((el) => {
                const strs = el.split('-');
                return strs[strs.length - 1];
            }),
            datasets: [
                {
                    label: 'Expense Flow',
                    fill: false,
                    tension: 0.2,
                    borderColor: colorScheme.error,
                    data: expenseData.map((el) => el.amount),
                },
                {
                    label: 'Income Flow',
                    fill: false,
                    tension: 0.2,
                    borderColor: colorScheme.success,
                    data: incomeData.map((el) => el.amount),
                },
            ],
        };
    }, [expenseData, incomeData, colorScheme]);

    useEffect(() => {
        if (!showExpense) {
            setExpenseData([]);
            return;
        }
        (async () => {
            setLoadingExpense(true);
            let res: QueryResultOne<TransactionFlow>;
            if (flowScale === 'everyday')
                res = await ReportRepo.getCashFlowEveryDay(session?.user.id ?? '', 'expense', flowDate ?? new Date());
            else
                res = await ReportRepo.getCashFlowEveryMonth(
                    session?.user.id ?? '',
                    'expense',
                    flowDate?.getFullYear() ?? new Date().getFullYear(),
                );
            setLoadingExpense(false);
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setExpenseData(res.data ?? []);
        })();
    }, [session, flowDate, showExpense]);

    useEffect(() => {
        if (!showIncome) {
            setIncomeData([]);
            return;
        }
        (async () => {
            setLoadingIncome(true);
            let res: QueryResultOne<TransactionFlow>;
            if (flowScale === 'everyday')
                res = await ReportRepo.getCashFlowEveryDay(session?.user.id ?? '', 'income', flowDate ?? new Date());
            else
                res = await ReportRepo.getCashFlowEveryMonth(
                    session?.user.id ?? '',
                    'income',
                    flowDate?.getFullYear() ?? new Date().getFullYear(),
                );
            setLoadingIncome(false);
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setIncomeData(res.data ?? []);
        })();
    }, [session, flowDate, showIncome]);

    return (
        <div className="flex flex-1 flex-col items-center gap-4 overflow-x-auto pt-2">
            <div className="flex w-full flex-col items-center gap-2 rounded-xl bg-base-100 p-2">
                <div className="flex items-center gap-4">
                    <select
                        disabled={loading}
                        value={flowScale}
                        onChange={(e) => {
                            setFlowDate(new Date());
                            setFlowScale(e.target.value as 'everyday' | 'everymonth');
                        }}
                        className="dai-select dai-select-bordered dai-select-xs xs:dai-select-sm"
                    >
                        <option value="everyday">Every Day</option>
                        <option value="everymonth">Every Month</option>
                    </select>
                    <div className="dai-form-control">
                        <label className="dai-cursor-pointer dai-label justify-start gap-2">
                            <input
                                disabled={loading}
                                type="checkbox"
                                checked={showExpense}
                                onChange={(e) => setShowExpense(e.target.checked)}
                                className="dai-checkbox-error dai-checkbox dai-checkbox-sm"
                            />
                            <span className="dai-label-text">Expense</span>
                        </label>
                    </div>
                    <div className="dai-form-control">
                        <label className="dai-cursor-pointer dai-label justify-start gap-2">
                            <input
                                disabled={loading}
                                type="checkbox"
                                checked={showIncome}
                                onChange={(e) => setShowIncome(e.target.checked)}
                                className="dai-checkbox-success dai-checkbox dai-checkbox-sm"
                            />
                            <span className="dai-label-text">Income</span>
                        </label>
                    </div>
                </div>
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
                                              flowScale === 'everymonth'
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
                                : flowScale === 'everymonth'
                                  ? formarterMonth.format(flowDate)
                                  : formarterDay.format(flowDate)}
                        </span>
                        <button
                            disabled={loading || !flowDate}
                            onClick={() =>
                                setFlowDate((prev) =>
                                    !prev
                                        ? undefined
                                        : new Date(
                                              flowScale === 'everymonth'
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
                                    label: flowDate
                                        ? 'All time'
                                        : flowScale === 'everymonth'
                                          ? 'This year'
                                          : 'This month',
                                    onClick: () => setFlowDate((prev) => (prev ? undefined : new Date())),
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full rounded-xl bg-base-100 p-4">
                <Line
                    data={expenseChart}
                    className="h-56"
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                type: 'logarithmic',
                                ticks: {
                                    color: colorScheme['base-content'],
                                    callback: (value) => {
                                        if (typeof value === 'string') return value;
                                        return (
                                            formatNumeric(value / (value >= 1000 ? 1000 : 1)) +
                                            (value >= 1000 ? 'K' : '')
                                        );
                                    },
                                },
                            },
                            x: {
                                ticks: {
                                    color: colorScheme['base-content'],
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default CashFlowReportPage;
