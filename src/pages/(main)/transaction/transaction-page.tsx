import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import logoImg from '/vite.svg';
import { Icon } from '@/components/icon';
import { handleLogout } from '@/helper/logout';
import { isDarkAtom } from '@/stores/theme';
import { formatDate } from '@/helper/format-date';
import { formatCurrency } from '@/helper/format-currency';

interface TransactionPageProps {}

const TransactionPage: FC<TransactionPageProps> = () => {
    const [isDark, setIsDark] = useAtom(isDarkAtom);
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    useEffect(() => {
        setAppBarCtx({
            title: <img src={logoImg} alt="Logo" />,
            actions: [
                <button className="mr-1 p-1 text-xl text-yellow-400" onClick={() => setIsDark(!isDark)}>
                    {isDark ? <Icon icon="lucide:sun" /> : <Icon icon="lucide:moon" />}
                </button>,
                <button className="dai-btn dai-btn-error dai-btn-sm text-lg" onClick={handleLogout}>
                    <Icon icon="lucide:log-out" />
                </button>,
            ],
        });
    }, [isDark]);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <div className="flex flex-col gap-2">
                <div className="border-b-2 border-b-primary">
                    <span>{formatDate(new Date(), { lang: 'en-US' })}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <img className="size-12" src="/categories/food.png" alt="" />
                        <div className="flex w-full items-center justify-between gap-4 border-b border-b-primary py-2">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-lg">Food</span>
                                <span className="text-sm"></span>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 font-semibold">
                                <span
                                    className={'text-nowrap text-lg ' + (-10_000 > 0 ? 'text-success' : 'text-error')}
                                >
                                    {formatCurrency(-10_000)}
                                </span>
                                <div className="flex items-center gap-2 text-sm">
                                    <img className="size-5" src="/accounts/bri.webp" alt="" />
                                    <span>BRI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <img className="size-12" src="/categories/transportation.png" alt="" />
                        <div className="flex w-full items-center justify-between gap-4 border-b border-b-primary py-2">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-lg">Transportation</span>
                                <span className="text-sm"></span>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 font-semibold">
                                <span
                                    className={'text-nowrap text-lg ' + (-10_000 > 0 ? 'text-success' : 'text-error')}
                                >
                                    {formatCurrency(-10_000)}
                                </span>
                                <div className="flex items-center gap-1 text-sm">
                                    <img className="size-5" src="/accounts/bri.webp" alt="" />
                                    <span>BRI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionPage;
