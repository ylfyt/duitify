import { Database } from '@/database.types';
import { Category } from './category.type';

export type ExpenseOverview = {
    amount: number;
    count: number;
    category?: {
        id: Category['id'];
        name: Category['name'];
        logo: Category['logo'];
    } | null;
};

export type TransactionFlow = Database['public']['Functions']['get_transaction_flow']['Returns'];

export type IncomeExpense = Database['public']['Functions']['get_income_expense_per_month']['Returns'];
