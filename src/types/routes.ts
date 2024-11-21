import { IconName } from '@/components/icon';

export type Route = {
    link: string;
    icon: IconName;
    title: string;
    el: React.FC;
    layout?: boolean;
};
