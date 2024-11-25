import { Category, CategoryCreateDto, CategoryType, CategoryUpdateDto } from '@/types/category.type';
import { BaseRepo, QueryResultEmpty, QueryResultMany, QueryResultOne } from './base-repo';

export class CategoryRepo extends BaseRepo {
    public static async getCategories(): Promise<QueryResultMany<Category>> {
        return this.db.from('category').select('*').order('name', { ascending: true });
    }

    public static async getCategoryByType(type: CategoryType): Promise<QueryResultMany<Category>> {
        return this.db.from('category').select('*').eq('type', type).order('name', { ascending: true });
    }

    public static async createCategory(data: CategoryCreateDto): Promise<QueryResultOne<Category>> {
        return this.db.from('category').insert(data).select().single();
    }

    public static async updateCategory(id: string, data: CategoryUpdateDto): Promise<QueryResultOne<Category>> {
        return this.db.from('category').update(data).eq('id', id).select().single();
    }

    public static async deleteCategory(id: string): Promise<QueryResultEmpty> {
        return await this.db.from('category').delete().eq('id', id);
    }
}
