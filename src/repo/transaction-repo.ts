import { Transaction, TransactionCreateDto } from '@/types/transaction.type';
import { BaseRepo, QueryResultMany, QueryResultOne } from './base-repo';

export class TransactionRepo extends BaseRepo {
    public static async getTransactions(): Promise<QueryResultMany<Transaction>> {
        return this.db
            .from('transaction')
            .select(
                `*, 
                category(id, name, logo),
                account:account!transaction_account_id_fkey(id, name, logo),
                to_account:account!transaction_to_account_id_fkey(id, name, logo)`,
            )
            .order('occurred_at', { ascending: false });
    }

    public static async create(data: TransactionCreateDto): Promise<QueryResultOne<Transaction>> {
        return this.db.from('transaction').insert(data).select().single();
    }
}
