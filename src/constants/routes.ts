import { Route } from '@/types/routes';
import { LayoutTransaction } from '@/pages/(main)/transaction/_layout';
import SettingPage from '@/pages/(main)/setting/setting-page';
import { LayoutAccount } from '@/pages/(main)/account/_layout';
import { LayoutReport } from '@/pages/(main)/report/_layout';
import { LayoutCategory } from '@/pages/(main)/category/_layout';

export const ROUTES: Route[] = [
    { icon: 'lucide:notebook-text', link: '/transaction', title: 'Trx', el: LayoutTransaction, layout: true },
    { icon: 'lucide:chart-pie', link: '/report', title: 'Report', el: LayoutReport, layout: true },
    { icon: 'lucide:wallet', link: '/accounts', title: 'Account', el: LayoutAccount, layout: true },
    { icon: 'lucide:group', link: '/category', title: 'Categories', el: LayoutCategory, layout: true },
    { icon: 'lucide:settings', link: '/settings', title: 'Settings', el: SettingPage },
];
