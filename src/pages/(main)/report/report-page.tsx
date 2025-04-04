import { ReportRepo } from '@/repo/report-repo';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Icon } from '@/components/icon';
import { ExpenseOverview } from '@/types/report.type';
import { DropdownMenu } from '@/components/dropdown-menu';
import { getDefaultStore, useAtom } from 'jotai';
import { settingsAtom } from '@/stores/settings';
import { sessionAtom } from '@/stores/auth';
import { ExpenseOverviewDetail } from './components/expense-overview-detail';

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
        <div className="flex flex-1 flex-col items-center gap-2 p-2">
            <div className="flex w-full items-center rounded-lg border bg-base-100 p-2">
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
            <ExpenseOverviewDetail
                expenses={data}
                loadingExpense={loading}
                totalExpense={total}
                totalIncome={totalIncome}
                loadingIncome={loadingIncome}
            />
        </div>
    );
};

export default ReportPage;
