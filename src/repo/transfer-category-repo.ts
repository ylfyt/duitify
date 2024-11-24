import { Category, CategoryCreateDto, CategoryUpdateDto } from '@/types/category.type';
import { BaseRepo, QueryResultEmpty, QueryResultMany, QueryResultOne } from './base-repo';

export class TransferCategoryRepo extends BaseRepo {
    public static async getCategories(): Promise<QueryResultMany<Category>> {
        return this.db.from('transfer_category').select('*').order('created_at', { ascending: false });
    }

    public static async createCategory(data: CategoryCreateDto): Promise<QueryResultOne<Category>> {
        return this.db.from('transfer_category').insert(data).select().single();
    }

    public static async updateCategory(id: string, data: CategoryUpdateDto): Promise<QueryResultOne<Category>> {
        return this.db.from('transfer_category').update(data).eq('id', id).select().single();
    }

    public static async deleteCategory(id: string): Promise<QueryResultEmpty> {
        return await this.db.from('transfer_category').delete().eq('id', id);
    }
}
