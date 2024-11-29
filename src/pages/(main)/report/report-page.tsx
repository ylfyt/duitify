import { ReportRepo } from '@/repo/report-repo';
import { ExpenseOverview } from '@/types/transaction.type';
import { ChartData } from 'chart.js';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Chart as ChartJS, Title, Tooltip, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { formatCurrency } from '@/helper/format-currency';
import { COLOR_RANKS } from '@/constants/color-ranks';
import { ENV } from '@/constants/env';
import { useAtom } from 'jotai';
import { appBarCtxAtom } from '@/stores/common';
import Skeleton from '@/components/skeleton';

ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, LinearScale);

interface ReportPageProps {}

const ReportPage: FC<ReportPageProps> = () => {
    const [, setAppBar] = useAtom(appBarCtxAtom);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ExpenseOverview[]>([]);

    const total = useMemo(() => data.reduce((acc, el) => acc + (el.amount ?? 0), 0), [data]);

    const colors = useMemo(() => data.map((_, idx) => COLOR_RANKS[idx] ?? COLOR_RANKS[COLOR_RANKS.length - 1]), [data]);
    const chartData = useMemo<ChartData<'doughnut', number[], string>>(
        () => ({
            labels: data.map((el) => el.name ?? 'unknown'),
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
        setAppBar({
            title: 'Report',
        });
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await ReportRepo.getExpenseOverview();
            setLoading(false);
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setData(res.data ?? []);
        })();
    }, []);

    return (
        <div className="flex flex-1 flex-col items-center gap-4 pt-4">
            {!loading && data.length === 0 ? (
                <div>No expense found</div>
            ) : (
                <div className="flex items-center gap-4">
                    <div className="xs:w-[14rem] aspect-square w-[10rem]">
                        {loading ? (
                            <Skeleton className="h-full w-full rounded-full">
                                <div></div>
                            </Skeleton>
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
                    <div className="flex flex-col gap-1">
                        {loading
                            ? Array.from({ length: 14 }).map((_, idx) => <ChartLegendSkeleton key={idx} />)
                            : data.map((el, idx) => (
                                  <ChartLegend key={idx} name={el.name ?? 'unknown'} color={colors[idx]} />
                              ))}
                    </div>
                </div>
            )}
            <div className="grid w-full grid-cols-1 gap-1 md:grid-cols-2">
                {loading
                    ? Array.from({ length: 5 }).map((_, idx) => <ReportExpenseCardSkeleton key={idx} />)
                    : data.map((el, idx) => <ReportExpenseCard key={idx} el={el} total={total} />)}
            </div>
        </div>
    );
};

export default ReportPage;

interface ReportExpenseCardProps {
    el: ExpenseOverview;
    total: number;
}

const ReportExpenseCard: FC<ReportExpenseCardProps> = ({ el, total }) => {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-base-100 px-3 py-2 shadow">
            <img className="size-12" src={ENV.BASE_URL + el.logo} alt="" />
            <div className="flex w-full flex-col gap-1">
                <div className="flex justify-between">
                    <span>{el.name}</span>
                    <span className="font-medium text-error">{formatCurrency(-1 * (el.amount ?? 0))}</span>
                </div>
                <div className="flex items-center gap-2">
                    <progress
                        className="dai-progress dai-progress-primary"
                        value={el.amount ?? 0}
                        max={total}
                    ></progress>
                    <span className="text-sm">{Math.round(100 * (total === 0 ? 0 : (el.amount ?? 0) / total))}%</span>
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
                <img className="size-12"></img>
            </Skeleton>
            <div className="flex w-full flex-col gap-1">
                <div className="flex justify-between">
                    <Skeleton>
                        <span>Food</span>
                    </Skeleton>
                    <Skeleton>
                        <span className="font-medium text-error">{formatCurrency(-1 * 10_000)}</span>
                    </Skeleton>
                </div>
                <div className="flex items-center gap-2">
                    <progress className="dai-progress dai-progress-primary dai-skeleton" value={0} max={0}></progress>
                    <span className="text-sm">
                        <Skeleton>28%</Skeleton>
                    </span>
                </div>
            </div>
        </div>
    );
};

interface ChartLegendProps {
    color: string;
    name: string;
}

const ChartLegend: FC<ChartLegendProps> = ({ name, color }) => {
    return (
        <div className="flex items-center gap-2">
            <span style={{ backgroundColor: color }} className="h-2 w-4"></span>
            <span>{name}</span>
        </div>
    );
};

interface ChartLegendSkeletonProps {}

const ChartLegendSkeleton: FC<ChartLegendSkeletonProps> = () => {
    return (
        <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-4">
                <div></div>
            </Skeleton>
            <Skeleton>
                <span>Transportation</span>
            </Skeleton>
        </div>
    );
};
