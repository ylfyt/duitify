import { Transaction, TransactionCreateDto, TransactionUpdateDto } from '@/types/transaction.type';
import { BaseRepo, QueryResultEmpty, QueryResultMany, QueryResultOne } from './base-repo';
import { formatDate } from '@/helper/format-date';
import { PAGINATION_SIZES } from '@/constants/common';

type PaginationFilter = {
    cursor?: string;
    account?: string | null;
};

export class TransactionRepo extends BaseRepo {
    public static async getTransactions({ cursor, account }: PaginationFilter): Promise<QueryResultMany<Transaction>> {
        const today = new Date();
        today.setDate(today.getDate() + 2);

        const q = this.db.from('transaction').select(
            `*, 
                category(id, name, logo),
                account:account!transaction_account_id_fkey(id, name, logo),
                to_account:account!transaction_to_account_id_fkey(id, name, logo)`,
        );
        if (account) q.or(`account_id.eq.${account}, to_account_id.eq.${account}`);
        return q
            .order('occurred_at', { ascending: false })
            .lt('occurred_at', !cursor ? formatDate(today, { format: 'yyyy-MM-dd HH:mm:ss' }) : cursor)
            .limit(PAGINATION_SIZES[0]);
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
