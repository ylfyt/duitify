import { Category } from '@/types/category.type';
import { BaseRepo, QueryResultMany } from './base-repo';

export class ExpenseCategoryRepo extends BaseRepo {
    public static async getCategories(): Promise<QueryResultMany<Category>> {
        return this.db.from('expense_category').select('*').order('created_at', { ascending: false });
    }
}
