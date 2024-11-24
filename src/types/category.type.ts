import { Database } from '@/database.types';

export type Category = Database['user_schema']['Tables']['expense_category']['Row'];

export type CategoryCreateDto = Database['user_schema']['Tables']['expense_category']['Insert'];

export type CategoryUpdateDto = Database['user_schema']['Tables']['expense_category']['Update'];
