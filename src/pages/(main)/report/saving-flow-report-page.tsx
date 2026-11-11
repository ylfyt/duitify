import { LineChart } from '@/components/line-chart';
import { CondSkeleton } from '@/components/skeleton';
import { abbreviate } from '@/helper/abbreviate';
import { formatCurrency } from '@/helper/format-currency';
import { formatDate } from '@/helper/format-date';
import { formatNumeric } from '@/helper/format-numeric';
import { ReportRepo } from '@/repo/report-repo';
import { sessionAtom } from '@/stores/auth';
import { useColorScheme } from '@/stores/theme';
import { IncomeExpense } from '@/types/report.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const SavingFlowReportPage: FC<{}> = () => {
    const colorScheme = useColorScheme();
    const [session] = useAtom(sessionAtom);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IncomeExpense>([]);

    const totalIncome = useMemo(() => data.reduce((prev, curr) => curr.income + prev, 0), [data]);
    const totalExpense = useMemo(() => data.reduce((prev, curr) => curr.expense + prev, 0), [data]);

    const chartData = useMemo(() => {
        const assets: number[] = [];
        const expenses: number[] = [];
        const incomes: number[] = [];
        const labels: string[] = [];

        for (let i = data.length - 1; i >= 0; i--) {
            const el = data[i];

            let last = assets[assets.length - 1];
            if (last == null) last = 0;
            assets.push(last + el.income - el.expense);

            expenses.push(el.expense);
            incomes.push(el.income);
            labels.push(el.occurred_at.slice(2).replace('-', ''));
        }

        return { assets, labels, incomes, expenses };
    }, [data]);

    useEffect(() => {
        if (!session?.user.id) return;
        (async () => {
            setLoading(true);
            const res = await ReportRepo.getIncomeExpensePerMonth(session.user.id, new Date().getFullYear());
            setLoading(false);
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setData(res.data || []);
        })();
    }, [session]);

    return (
        <div className="flex flex-1 flex-col items-center gap-2 p-2">
            <div className="flex w-full flex-col gap-2 text-xs">
                <div className="rounded-lg border bg-base-100">
                    <div className="flex px-2 text-base-content-accent">
                        <div className="flex flex-1 flex-col items-center gap-0.5 py-2">
                            <CondSkeleton skel={loading}>
                                <span>Income </span>
                            </CondSkeleton>
                            <CondSkeleton skel={loading}>
                                <span className="text-sm text-success">
                                    {formatCurrency(loading ? 10_123_000 : totalIncome)}
                                </span>
                            </CondSkeleton>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-0.5 border-x py-2">
                            <CondSkeleton skel={loading}>
                                <span>Expense</span>
                            </CondSkeleton>
                            <CondSkeleton skel={loading}>
                                <span className="text-sm text-error">
                                    {formatCurrency(loading ? 10_123_000 : -1 * totalExpense)}
                                </span>
                            </CondSkeleton>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-0.5 py-2">
                            <CondSkeleton skel={loading}>
                                <span>Save</span>
                            </CondSkeleton>
                            <CondSkeleton skel={loading}>
                                <span className="text-sm text-success">
                                    {formatCurrency(loading ? 10_123_000 : totalIncome - totalExpense)}
                                </span>{' '}
                            </CondSkeleton>
                        </div>
                    </div>
                </div>

                <div className="flex min-h-[14rem] flex-col rounded-lg border bg-base-100 p-2 text-xxs">
                    <LineChart
                        legend={true}
                        yFormatter={abbreviate}
                        data={{
                            datasets: [
                                {
                                    data: chartData.assets,
                                    label: 'Save',
                                    color: colorScheme.primary,
                                },
                                { data: chartData.expenses, label: 'Expense', color: colorScheme.error },
                                { data: chartData.incomes, label: 'Income', color: colorScheme.success },
                            ],
                            labels: chartData.labels,
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 gap-2 rounded-lg border bg-base-100 p-2 text-xxs">
                    {data.map((el, idx) => {
                        const save = el.income - el.expense;
                        const lastAsset = chartData.assets[chartData.assets.length - idx - 1] ?? 0;
                        const prevAsset = lastAsset - save;
                        const saveP = !el.income ? 0 : (save / el.income) * 100;
                        const assetP = !prevAsset ? 0 : (save / prevAsset) * 100;
                        return (
                            <div
                                className={
                                    'flex items-center gap-2 ' + (idx !== data.length - 1 ? 'border-b pb-2' : '')
                                }
                                key={el.occurred_at}
                            >
                                <span className="w-[3.8rem] text-center font-semibold">
                                    {formatDate(el.occurred_at, { lang: 'en-US', day: 'hide', weekday: 'hide' })}
                                </span>
                                <span className="flex flex-1 items-center gap-1 text-center">
                                    <p className="rounded-sm bg-primary/10 px-1.5">Assets</p>
                                    <p>{abbreviate(lastAsset)}</p>
                                    <p className={assetP > 0 ? 'text-success' : assetP < 0 ? 'text-error' : ''}>
                                        ({assetP > 0 ? '+' : ''}
                                        {formatNumeric(assetP)}%)
                                    </p>
                                </span>
                                <span className="flex flex-1 items-center gap-1 text-center">
                                    <p className="rounded-sm bg-primary/10 px-1.5">Save</p>
                                    <p>{abbreviate(save)}</p>
                                    <p className={save > 0 ? 'text-success' : save < 0 ? 'text-error' : ''}>
                                        ({save > 0 ? '+' : ''}
                                        {formatNumeric(saveP)}%)
                                    </p>
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SavingFlowReportPage;
