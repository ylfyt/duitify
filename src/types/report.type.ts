import { Category } from './category.type';

export type ExpenseOverview = {
    amount: number;
    category?: {
        id: Category['id'];
        name: Category['name'];
        logo: Category['logo'];
    } | null;
};
