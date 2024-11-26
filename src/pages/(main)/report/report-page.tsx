import { ReportRepo } from '@/repo/report-repo';
import { ExpenseOverview } from '@/types/transaction.type';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ReportPageProps {}

const ReportPage: FC<ReportPageProps> = () => {
    const [data, setData] = useState<ExpenseOverview[]>([]);

    useEffect(() => {
        (async () => {
            const res = await ReportRepo.getExpenseOverview();
            if (res.error) {
                toast.error(res.error.message);
                return;
            }
            setData(res.data ?? []);
        })();
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <div>report</div>
            <div>
                {data.map((el, idx) => (
                    <div key={idx}>
                        <span>{el.name}</span>
                        <span>{el.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportPage;
