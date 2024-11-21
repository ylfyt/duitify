import { Database } from '@/database.types';

export type Account = Database['user_schema']['Tables']['account']['Row'];

export type AccountCreateDto = Database['user_schema']['Tables']['account']['Insert'];

export type AccountUpdateDto = Database['user_schema']['Tables']['account']['Update'];
