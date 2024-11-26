import { ExpenseOverview } from '@/types/transaction.type';
import { BaseRepo, QueryResultMany } from './base-repo';

export class ReportRepo extends BaseRepo {
    public static async getExpenseOverview(): Promise<QueryResultMany<ExpenseOverview>> {
        return this.db.from('expense_overview').select('*');
    }
}
