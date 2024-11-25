import { Route } from '@/types/routes';
import TransactionPage from '@/pages/(main)/transaction/transaction-page';
import AccountPage from '@/pages/(main)/account/account-page';
import CategoryPage from '@/pages/(main)/category/category-page';

export const ROUTES: Route[] = [
    { icon: 'lucide:house', link: '/', title: 'Home', el: TransactionPage },
    { icon: 'lucide:wallet', link: '/accounts', title: 'Account', el: AccountPage },
    { icon: 'lucide:group', link: '/category', title: 'Categories', el: CategoryPage },
];
