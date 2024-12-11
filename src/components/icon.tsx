import { FC, SVGProps, useMemo } from 'react';
import IconLucideHouse from '~icons/lucide/house';
import IconLucideChartPie from '~icons/lucide/chart-pie';
import IconLucideHistory from '~icons/lucide/history';
import IconMynauiCog from '~icons/mynaui/cog';
import IconLucideCircleAlert from '~icons/lucide/circle-alert';
import IconMdiCertificateOutline from '~icons/mdi/certificate-outline';
import IconLucidePieChart from '~icons/lucide/pie-chart';
import IconMdiGearOutline from '~icons/mdi/gear-outline';
import IconMdiArrowLeft from '~icons/mdi/arrow-left';
import IconMdiMedalOutline from '~icons/mdi/medal-outline';
import IconMdiCircleSlice8 from '~icons/mdi/circle-slice-8';
import IconLucideLogOut from '~icons/lucide/log-out';
import IconLucideSearch from '~icons/lucide/search';
import IconLucideSettings2 from '~icons/lucide/settings-2';
import IconMdiDownload from '~icons/mdi/download';
import IconLucideEye from '~icons/lucide/eye';
import IconLucideEyeOff from '~icons/lucide/eye-off';
import IconLucideFile from '~icons/lucide/file';
import IconLucideCheckCircle from '~icons/lucide/check-circle';
import IconLucideXCircle from '~icons/lucide/x-circle';
import IconLucideCircleCheck from '~icons/lucide/circle-check';
import IconLucideOctagonAlert from '~icons/lucide/octagon-alert';
import IconLucideTriangleAlert from '~icons/lucide/triangle-alert';
import IconLucideInfo from '~icons/lucide/info';
import IconLucideWallet from '~icons/lucide/wallet';
import IconLucideMoreVertical from '~icons/lucide/more-vertical';
import IconLucidePencil from '~icons/lucide/pencil';
import IconLucidePlus from '~icons/lucide/plus';
import IconLucideSun from '~icons/lucide/sun';
import IconLucideMoon from '~icons/lucide/moon';
import IconLucideTrash from '~icons/lucide/trash';
import IconLucideGroup from '~icons/lucide/group';
import IconLucideArrowRight from '~icons/lucide/arrow-right';
import IconLucideX from '~icons/lucide/x';
import IconLucideSettings from '~icons/lucide/settings';
import IconLucideDownload from '~icons/lucide/download';
import IconLucideChevronRight from '~icons/lucide/chevron-right';
import IconLucideChevronLeft from '~icons/lucide/chevron-left';
import IconLucideDollarSign from '~icons/lucide/dollar-sign';
import IconLucideKeyboard from '~icons/lucide/keyboard';
import IconLucideCheck from '~icons/lucide/check';
import IconLucideCalendarDays from '~icons/lucide/calendar-days';
import IconLucideMenu from '~icons/lucide/menu';
import IconLucideCirclePlus from '~icons/lucide/circle-plus';
import IconLucideCircleMinus from '~icons/lucide/circle-minus';
import IconLucideAppWindow from '~icons/lucide/app-window';

const Icons = {
    'lucide:house': IconLucideHouse,
    'lucide:chart-pie': IconLucideChartPie,
    'lucide:history': IconLucideHistory,
    'mynaui:cog': IconMynauiCog,
    'lucide:circle-alert': IconLucideCircleAlert,
    'mdi:certificate-outline': IconMdiCertificateOutline,
    'lucide:pie-chart': IconLucidePieChart,
    'mdi:gear-outline': IconMdiGearOutline,
    'mdi:arrow-left': IconMdiArrowLeft,
    'mdi:medal-outline': IconMdiMedalOutline,
    'mdi:circle-slice-8': IconMdiCircleSlice8,
    'lucide:log-out': IconLucideLogOut,
    'lucide:search': IconLucideSearch,
    'lucide:settings-2': IconLucideSettings2,
    'mdi:download': IconMdiDownload,
    'lucide:eye': IconLucideEye,
    'lucide:eye-off': IconLucideEyeOff,
    'lucide:file': IconLucideFile,
    'lucide:check-circle': IconLucideCheckCircle,
    'lucide:x-circle': IconLucideXCircle,
    'lucide:circle-check': IconLucideCircleCheck,
    'lucide:octagon-alert': IconLucideOctagonAlert,
    'lucide:triangle-alert': IconLucideTriangleAlert,
    'lucide:info': IconLucideInfo,
    'lucide:wallet': IconLucideWallet,
    'lucide:more-vertical': IconLucideMoreVertical,
    'lucide:pencil': IconLucidePencil,
    'lucide:plus': IconLucidePlus,
    'lucide:sun': IconLucideSun,
    'lucide:moon': IconLucideMoon,
    'lucide:trash': IconLucideTrash,
    'lucide:group': IconLucideGroup,
    'lucide:arrow-right': IconLucideArrowRight,
    'lucide:x': IconLucideX,
    'lucide:settings': IconLucideSettings,
    'lucide:download': IconLucideDownload,
    'lucide:chevron-right': IconLucideChevronRight,
    'lucide:dollar-sign': IconLucideDollarSign,
    'lucide:keyboard': IconLucideKeyboard,
    'lucide:check': IconLucideCheck,
    'lucide:chevron-left': IconLucideChevronLeft,
    'lucide:calendar-days': IconLucideCalendarDays,
    'lucide:menu': IconLucideMenu,
    'lucide:circle-plus': IconLucideCirclePlus,
    'lucide:circle-minus': IconLucideCircleMinus,
    'lucide:app-window': IconLucideAppWindow,
};

export type IconName = keyof typeof Icons;

interface IconProps extends SVGProps<SVGSVGElement> {
    icon: IconName;
}

export const Icon: FC<IconProps> = ({ icon, ...props }) => {
    const Element = useMemo(() => Icons[icon], [icon]);
    return <Element {...props} />;
};
