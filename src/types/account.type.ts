import { Database } from '@/database.types';

export type Account = Database['public']['Tables']['account']['Row'];

export type AccountCreateDto = Database['public']['Tables']['account']['Insert'];

export type AccountUpdateDto = Database['public']['Tables']['account']['Update'];
