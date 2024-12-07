import { BaseRepo, QueryResultMany, QueryResultOne } from './base-repo';
import { formatDate, LOCAL_TIMEZONE } from '@/helper/format-date';
import { settingsAtom } from '@/stores/settings';
import { supabase } from '@/supabase';
import { ExpenseOverview, TransactionFlow } from '@/types/report.type';
import { getDefaultStore } from 'jotai';

const store = getDefaultStore();

export class ReportRepo extends BaseRepo {
    private static getDateRanges(useOffset: boolean, date?: Date, monthEnd?: Date): { start: Date; end: Date } {
        if (!date)
            return {
                start: new Date(0),
                end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            };

        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(
            monthEnd?.getFullYear() ?? date.getFullYear(),
            (monthEnd?.getMonth() ?? date.getMonth()) + 1,
            1,
        );
        const settings = store.get(settingsAtom);
        if (useOffset && settings?.month_end_date) {
            start.setMonth(start.getMonth() - 1);
            start.setDate(settings.month_end_date + 1);
            end.setMonth(end.getMonth() - 1);
            end.setDate(settings.month_end_date + 1);
        }
        return { start, end };
    }

    public static async getExpenseOverview(userId: string, month?: Date): Promise<QueryResultMany<ExpenseOverview>> {
        const { start, end } = this.getDateRanges(true, month);

        const { data, error } = await this.db
            .from('transaction')
            .select(`amount:amount.sum(), category(id, name, logo)`)
            .eq('user_id', userId)
            .eq('type', 'expense')
            .gte('occurred_at', formatDate(start, { format: 'yyyy-MM-dd HH:mm:ss', timeZone: 'UTC' }))
            .lt('occurred_at', formatDate(end, { format: 'yyyy-MM-dd HH:mm:ss', timeZone: 'UTC' }));

        const data2 = data as unknown as ExpenseOverview[];
        data2.sort((a, b) => b.amount - a.amount);
        return {
            error,
            data: data2,
        };
    }

    public static async getIncomeTotal(userId: string, month?: Date): Promise<QueryResultOne<number>> {
        const { start, end } = this.getDateRanges(true, month);

        const { data: data2, error } = await this.db
            .from('transaction')
            .select(`amount:amount.sum()`)
            .eq('user_id', userId)
            .eq('type', 'income')
            .gte('occurred_at', formatDate(start, { format: 'yyyy-MM-dd HH:mm:ss', timeZone: 'UTC' }))
            .lt('occurred_at', formatDate(end, { format: 'yyyy-MM-dd HH:mm:ss', timeZone: 'UTC' }))
            .single();

        const data = data2 as unknown as { amount: number } | null;
        return {
            error,
            data: data?.amount ?? 0,
        };
    }

    public static async getCashFlowEveryMonth({
        userId,
        trx_type,
        year,
        yearEnd,
        categories,
    }: {
        userId: string;
        trx_type: 'expense' | 'income';
        year: number;
        yearEnd?: number;
        categories: string[];
    }): Promise<QueryResultOne<TransactionFlow>> {
        const { start, end } = this.getDateRanges(false, new Date(year, 0), new Date(yearEnd ?? year + 1, 0));
        const { data, error } = await supabase
            .rpc('get_transaction_flow', {
                trx_type,
                day_flow: false,
                month_end_date: store.get(settingsAtom)?.month_end_date ?? 0,
                trx_user_id: userId,
                categories,
                time_zone: LOCAL_TIMEZONE,
            })
            .gte('occurred_at', formatDate(start, { format: 'yyyy-MM' }))
            .lt('occurred_at', formatDate(end, { format: 'yyyy-MM' }));
        return {
            data,
            error,
        };
    }

    public static async getCashFlowEveryDay({
        userId,
        trx_type,
        month,
        monthEnd,
        categories,
    }: {
        userId: string;
        trx_type: 'expense' | 'income';
        month: Date;
        monthEnd?: Date;
        categories: string[];
    }): Promise<QueryResultOne<TransactionFlow>> {
        const { start, end } = this.getDateRanges(true, month, monthEnd);

        const { data, error } = await supabase
            .rpc('get_transaction_flow', {
                day_flow: true,
                month_end_date: store.get(settingsAtom)?.month_end_date ?? 0,
                trx_type: trx_type,
                trx_user_id: userId,
                categories,
                time_zone: LOCAL_TIMEZONE,
            })
            .gte('occurred_at', formatDate(start, { format: 'yyyy-MM-dd' }))
            .lt('occurred_at', formatDate(end, { format: 'yyyy-MM-dd' }));
        return {
            data,
            error,
        };
    }
}
