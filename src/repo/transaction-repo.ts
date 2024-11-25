import { Transaction, TransactionCreateDto, TransactionUpdateDto } from '@/types/transaction.type';
import { BaseRepo, QueryResultEmpty, QueryResultMany, QueryResultOne } from './base-repo';

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

    public static async update(id: string, data: TransactionUpdateDto): Promise<QueryResultOne<Transaction>> {
        return this.db.from('transaction').update(data).eq('id', id).select().single();
    }

    public static async create(data: TransactionCreateDto): Promise<QueryResultOne<Transaction>> {
        return this.db.from('transaction').insert(data).select().single();
    }

    public static async delete(id: string): Promise<QueryResultEmpty> {
        return await this.db.from('transaction').delete().eq('id', id);
    }
}
