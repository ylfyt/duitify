import { Database } from '@/database.types';
import { Account } from './account.type';
import { Category } from './category.type';

export type TransactionType = Database['public']['Tables']['transaction']['Row']['type'];

export type Transaction = Database['public']['Tables']['transaction']['Row'] & {
    account: {
        id: Account['id'];
        name: Account['name'];
        logo: Account['logo'];
    } | null;
    to_account: {
        id: Account['id'];
        name: Account['name'];
        logo: Account['logo'];
    } | null;
    category: {
        id: Category['id'];
        name: Category['name'];
        logo: Category['logo'];
    } | null;
};

export type TransactionCreateDto = Database['public']['Tables']['transaction']['Insert'];

export type TransactionUpdateDto = Database['public']['Tables']['transaction']['Update'];
