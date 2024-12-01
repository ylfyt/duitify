import { BaseRepo, QueryResultMany } from './base-repo';
import { formatDate } from '@/helper/format-date';
import { settingsAtom } from '@/stores/settings';
import { ExpenseOverview } from '@/types/report.type';
import { getDefaultStore } from 'jotai';

const store = getDefaultStore();

export class ReportRepo extends BaseRepo {
    private static getDateRanges(date?: Date) {
        if (!date)
            return {
                start: new Date(0),
                end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            };

        const settings = store.get(settingsAtom);
        const start = new Date(date.getFullYear(), date.getMonth(), settings?.month_start_date ?? 1);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, settings?.month_start_date ?? 1);
        if ((settings?.month_start_date ?? 1) !== 1) {
            start.setMonth(start.getMonth() - 1);
            end.setMonth(end.getMonth() - 1);
        }
        return { start, end };
    }

    public static async getExpenseOverview(date?: Date): Promise<QueryResultMany<ExpenseOverview>> {
        const { start, end } = this.getDateRanges(date);

        const { data, error } = await this.db
            .from('transaction')
            .select(`amount:amount.sum(), category(id, name, logo)`)
            .gte('occurred_at', formatDate(start, { format: 'yyyy-MM-dd HH:mm:ss' }))
            .lt('occurred_at', formatDate(end, { format: 'yyyy-MM-dd HH:mm:ss' }))
            .eq('type', 'expense');
        const data2 = data as unknown as ExpenseOverview[];
        data2.sort((a, b) => b.amount - a.amount);
        return {
            error,
            data: data2,
        };
    }
}
