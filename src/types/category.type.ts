import { Database } from '@/database.types';

export type CategoryType = Database['public']['Tables']['category']['Row']['type'];

export type Category = Database['public']['Tables']['category']['Row'];

export type CategoryCreateDto = Database['public']['Tables']['category']['Insert'];

export type CategoryUpdateDto = Database['public']['Tables']['category']['Update'];
