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
    Point,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-toastify';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

interface CashFlowReportPageProps {}

const CashFlowReportPage: FC<CashFlowReportPageProps> = () => {
    const [session] = useAtom(sessionAtom);
    const [colorScheme] = useAtom(colorSchemeAtom);

    const [loadingExpense, setLoadingExpense] = useState(false);
    const [expenseData, setExpenseData] = useState<TransactionFlow>([]);

    const [showCart, setShowCart] = useState(true);
    const chartRef = useRef<Chart<'line', (number | Point | null)[], string> | null>(null);
    const expenseChart = useMemo<ChartData<'line', (number | Point | null)[], string>>(
        () => ({
            labels: expenseData.map((el) => el.occurred_at),
            datasets: [
                {
                    label: 'Expense Flow',
                    fill: false,
                    tension: 0.1,
                    borderColor: colorScheme.error,
                    data: expenseData.map((el) => el.amount),
                },
            ],
        }),
        [expenseData, colorScheme],
    );

    useEffect(() => {
        (async () => {
            setLoadingExpense(true);
            const { data, error } = await ReportRepo.getExpenseFlowEveryMonth(session?.user.id ?? '', 2024);
            setLoadingExpense(false);
            if (error) {
                toast.error(error.message);
                return;
            }
            setExpenseData(data ?? []);
        })();
    }, [session]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const handleResize = () => {
            setShowCart(false);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setShowCart(true);
            }, 2000);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="flex flex-1 flex-col items-center gap-4 pt-4">
            <div className="flex w-full flex-col items-center gap-4 rounded-xl bg-base-100 p-4">
                <div className="grid w-full place-items-center">
                    {showCart && (
                        <Line
                            ref={chartRef}
                            data={expenseChart}
                            options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        ticks: {
                                            color: colorScheme['base-content'],
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default CashFlowReportPage;
