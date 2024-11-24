import { Route } from '@/types/routes';
import HomePage from '@/pages/(main)/home/home-page';
import AccountPage from '@/pages/(main)/account/account-page';
import CategoryPage from '@/pages/(main)/category/category-page';

export const ROUTES: Route[] = [
    { icon: 'lucide:house', link: '/', title: 'Home', el: HomePage },
    { icon: 'lucide:wallet', link: '/accounts', title: 'Account', el: AccountPage },
    { icon: 'lucide:group', link: '/category', title: 'Categories', el: CategoryPage },
];
