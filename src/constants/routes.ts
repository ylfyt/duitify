import { Route } from '@/types/routes';
import CategoryPage from '@/pages/(main)/category/category-page';
import { LayoutTransaction } from '@/pages/(main)/transaction/_layout';
import ReportPage from '@/pages/(main)/report/report-page';
import SettingPage from '@/pages/(main)/setting/setting-page';
import { LayoutAccount } from '@/pages/(main)/account/_layout';

export const ROUTES: Route[] = [
    { icon: 'lucide:house', link: '/transaction', title: 'Home', el: LayoutTransaction, layout: true },
    { icon: 'lucide:chart-pie', link: '/report', title: 'Report', el: ReportPage },
    { icon: 'lucide:wallet', link: '/accounts', title: 'Account', el: LayoutAccount, layout: true },
    { icon: 'lucide:group', link: '/category', title: 'Categories', el: CategoryPage },
    { icon: 'lucide:settings', link: '/settings', title: 'Settings', el: SettingPage },
];