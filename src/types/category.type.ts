import { Database } from '@/database.types';

export type CategoryType = Database['user_schema']['Tables']['category']['Row']['type'];

export type Category = Database['user_schema']['Tables']['category']['Row'];

export type CategoryCreateDto = Database['user_schema']['Tables']['category']['Insert'];

export type CategoryUpdateDto = Database['user_schema']['Tables']['category']['Update'];
