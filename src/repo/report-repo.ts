import { BaseRepo, QueryResultMany } from './base-repo';
import { formatDate } from '@/helper/format-date';
import { ExpenseOverview } from '@/types/report.type';

export class ReportRepo extends BaseRepo {
    public static async getExpenseOverview(date?: Date): Promise<QueryResultMany<ExpenseOverview>> {
        let startDate: Date;
        let endDate: Date;
        if (date) {
            startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
        } else {
            startDate = new Date(0);
            endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        }

        const { data, error } = await this.db
            .from('transaction')
            .select(`amount:amount.sum(), category(id, name, logo)`)
            .gte('occurred_at', formatDate(startDate, { format: 'yyyy-MM-dd HH:mm:ss' }))
            .lt('occurred_at', formatDate(endDate, { format: 'yyyy-MM-dd HH:mm:ss' }))
            .eq('type', 'expense');
        const data2 = data as unknown as ExpenseOverview[];
        data2.sort((a, b) => b.amount - a.amount);
        return {
            error,
            data: data2,
        };
    }
}
