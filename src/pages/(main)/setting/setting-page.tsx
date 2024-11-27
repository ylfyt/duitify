import { Icon } from '@/components/icon';
import { ENV } from '@/constants/env';
import { handleLogout } from '@/helper/logout';
import { sessionAtom } from '@/stores/auth';
import { appBarCtxAtom } from '@/stores/common';
import { isDarkAtom } from '@/stores/theme';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';

interface SettingPageProps {}

const SettingPage: FC<SettingPageProps> = () => {
    const [, setAppBar] = useAtom(appBarCtxAtom);
    const [session] = useAtom(sessionAtom);
    const [isDark, setIsDark] = useAtom(isDarkAtom);

    useEffect(() => {
        setAppBar({
            title: 'Settings',
        });
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <div className="flex items-center gap-4 rounded-xl bg-base-100 p-4">
                <img src={ENV.BASE_URL + '/categories/invest.webp'} className="size-16" alt="" />
                <div className="flex flex-col gap-0.5">
                    <span>{session?.user.email}</span>
                </div>
            </div>
            <div>
                <div className="flex flex-col gap-1">
                    <span>Settings</span>
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
