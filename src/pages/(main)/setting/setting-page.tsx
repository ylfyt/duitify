import { Icon } from '@/components/icon';
import { ENV } from '@/constants/env';
import { formatCurrency } from '@/helper/format-currency';
import { formatNumberToDate } from '@/helper/format-number-to-date';
import { handleLogout } from '@/helper/logout';
import { sessionAtom } from '@/stores/auth';
import { appBarCtxAtom, showLoading } from '@/stores/common';
import { settingsAtom } from '@/stores/settings';
import { isDarkAtom } from '@/stores/theme';
import { supabase } from '@/supabase';
import { useAtom } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface SettingPageProps {}

const SettingPage: FC<SettingPageProps> = () => {
    const [, setAppBar] = useAtom(appBarCtxAtom);
    const [session] = useAtom(sessionAtom);
    const [isDark, setIsDark] = useAtom(isDarkAtom);

    const [settings, setSettings] = useAtom(settingsAtom);

    const [isEditMaxAmount, setIsEditMaxAmount] = useState(false);
    const [maxAmount, setMaxAmount] = useState(settings?.max_visible_amount?.toString() ?? '');

    const [isEditEndMonth, setIsEditEndMonth] = useState(false);
    const [endMonth, setEndMonth] = useState(settings?.month_end_date?.toString() ?? '');

    useEffect(() => {
        setAppBar({
            title: 'Settings',
        });
    }, []);

    const updateHideAmount = async () => {
        const hide_amount = !settings?.hide_amount;
        showLoading(true);
        const res = await supabase
            .from('settings')
            .update({ hide_amount })
            .eq('id', settings?.id ?? 0);
        showLoading(false);
        if (res.error) {
            toast.error(res.error.message);
            return;
        }
        setSettings({ ...settings!, hide_amount });
    };

    const handleEditMaxAmount = async () => {
        if (!isEditMaxAmount) {
            setIsEditMaxAmount(true);
            return;
        }

        showLoading(true);
        const res = await supabase
            .from('settings')
            .update({ max_visible_amount: parseFloat(maxAmount) })
            .eq('id', settings?.id ?? 0);
        showLoading(false);
        if (res.error) {
            toast.error(res.error.message);
            return;
        }
        setSettings({ ...settings!, max_visible_amount: parseFloat(maxAmount) });
        setIsEditMaxAmount(false);
    };

    const handleEditEndMonth = async () => {
        if (!isEditEndMonth) {
            setIsEditEndMonth(true);
            return;
        }

        const month_end_date = !endMonth ? null : parseInt(endMonth);

        showLoading(true);
        const res = await supabase
            .from('settings')
            .update({ month_end_date })
            .eq('id', settings?.id ?? 0);
        showLoading(false);
        if (res.error) {
            toast.error(res.error.message);
            return;
        }
        setSettings({ ...settings!, month_end_date });
        setIsEditEndMonth(false);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 pt-2">
            <div className="flex items-center gap-4 rounded-xl bg-base-100 p-4">
                <img src={ENV.BASE_URL + '/icons/icon-192x192.png'} className="size-16" alt="" />
                <div className="flex flex-col gap-0.5">
                    <span>{session?.user.email}</span>
                </div>
            </div>
            <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-1">
                    <span className="font-medium">Security</span>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between rounded-xl bg-base-100 p-3 shadow">
                            <div className="flex items-center gap-2">
                                <Icon icon="lucide:keyboard" />
                                <span>PIN</span>
                            </div>
                            <button>
                                <Icon icon="lucide:pencil" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-base-100 p-3 shadow">
                            <div className="flex items-center gap-2">
                                <Icon icon="lucide:eye-off" />
                                <span>Hide Amount</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={!!settings?.hide_amount}
                                onChange={updateHideAmount}
                                className="dai-toggle dai-toggle-success dai-toggle-sm"
                            />
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-base-100 p-3 shadow">
                            <div className="flex items-center gap-2">
                                <Icon icon="lucide:eye" />
                                <span>Max amount always visible</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {!isEditMaxAmount ? (
                                    <span>{formatCurrency(settings?.max_visible_amount ?? 0)}</span>
                                ) : (
                                    <input
                                        min={0}
                                        type="number"
                                        value={maxAmount}
                                        onChange={(e) => setMaxAmount(e.target.value)}
                                        className="dai-input dai-input-xs dai-input-bordered max-w-24 text-end"
                                    />
                                )}
                                <button
                                    disabled={
                                        isEditMaxAmount &&
                                        (!maxAmount || isNaN(parseFloat(maxAmount)) || parseFloat(maxAmount) < 0)
                                    }
                                    onClick={handleEditMaxAmount}
                                >
                                    {isEditMaxAmount ? <Icon icon="lucide:check" /> : <Icon icon="lucide:pencil" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="font-medium">Report</span>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between rounded-xl bg-base-100 p-3 shadow">
                            <div className="flex items-center gap-2">
                                <Icon icon="lucide:calendar-days" />
                                <span>End of the month</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {!isEditEndMonth ? (
                                    <span>
                                        {!settings?.month_end_date ? '' : formatNumberToDate(settings.month_end_date)}
                                    </span>
                                ) : (
                                    <input
                                        min={0}
                                        type="number"
                                        value={endMonth}
                                        onChange={(e) => setEndMonth(e.target.value)}
                                        className="dai-input dai-input-xs dai-input-bordered max-w-24 text-end"
                                    />
                                )}
                                <button
                                    disabled={
                                        isEditEndMonth &&
                                        !!endMonth &&
                                        (isNaN(parseFloat(endMonth)) || parseFloat(endMonth) < 2)
                                    }
                                    onClick={handleEditEndMonth}
                                >
                                    {isEditEndMonth ? <Icon icon="lucide:check" /> : <Icon icon="lucide:pencil" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="font-medium">Settings</span>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between rounded-xl bg-base-100 p-3 shadow">
                            <div className="flex items-center gap-2">
                                <Icon icon="lucide:moon" />
                                <span>Dark Mode</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={isDark}
                                onChange={(e) => setIsDark(e.target.checked)}
                                className="dai-toggle dai-toggle-success dai-toggle-sm"
                            />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-between rounded-xl bg-base-100 p-3 shadow"
                        >
                            <div className="flex items-center gap-2">
                                <Icon icon="lucide:log-out" />
                                <span>Logout</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingPage;
