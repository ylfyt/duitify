import { Route } from '@/types/routes';
import AccountPage from '@/pages/(main)/account/account-page';
import CategoryPage from '@/pages/(main)/category/category-page';
import { LayoutTransaction } from '@/pages/(main)/transaction/_layout';

export const ROUTES: Route[] = [
    { icon: 'lucide:house', link: '/transaction', title: 'Home', el: LayoutTransaction, layout: true },
    { icon: 'lucide:wallet', link: '/accounts', title: 'Account', el: AccountPage },
    { icon: 'lucide:group', link: '/category', title: 'Categories', el: CategoryPage },
];
