import { Account, AccountCreateDto } from '@/types/account.type';
import { BaseRepo, QueryResultMany, QueryResultOne } from './base-repo';

export class AccountRepo extends BaseRepo {
    public static async getAccounts(): Promise<QueryResultMany<Account>> {
        return this.db.from('account').select('*').order('created_at', { ascending: false });
    }

    public static async createAccount(data: AccountCreateDto): Promise<QueryResultOne<Account>> {
        return this.db.from('account').upsert(data).select().single();
    }
}
