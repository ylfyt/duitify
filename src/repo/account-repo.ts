import { Account, AccountCreateDto, AccountUpdateDto } from '@/types/account.type';
import { BaseRepo, QueryResultEmpty, QueryResultMany, QueryResultOne } from './base-repo';

export class AccountRepo extends BaseRepo {
    public static async getAccounts(): Promise<QueryResultMany<Account>> {
        return this.db.from('account').select('*').order('created_at', { ascending: false });
    }

    public static async createAccount(data: AccountCreateDto): Promise<QueryResultOne<Account>> {
        return this.db.from('account').upsert(data).select().single();
    }

    public static async updateAccount(id: string, data: AccountUpdateDto): Promise<QueryResultOne<Account>> {
        return this.db.from('account').update(data).eq('id', id).select().single();
    }

    public static async deleteAccount(id: string): Promise<QueryResultEmpty> {
        return await this.db.from('account').delete().eq('id', id);
    }
}
