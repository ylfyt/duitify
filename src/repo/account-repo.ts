import { BaseRepo } from './base-repo';

export class AccountRepo extends BaseRepo {
    public static async getAccounts() {
        return this.db.from('account').select('*');
    }
}
