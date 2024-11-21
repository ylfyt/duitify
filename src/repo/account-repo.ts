import { Account } from '@/types/account.type';
import { BaseRepo, QueryResultMany } from './base-repo';

export class AccountRepo extends BaseRepo {
    public static async getAccounts(): Promise<QueryResultMany<Account>> {
        return this.db.from('account').select('*');
    }
}
