import { Route, Routes, useBlocker, useNavigate } from 'react-router-dom';
import { NotFound } from './not-found-page';
import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { sessionAtom } from '@/stores/auth';
import { AppBar } from '@/components/app-bar';
import { MobileNavbar } from '@/components/navbar/mobile-navbar';
import { ROUTES } from '@/constants/routes';
import ScrollToTop from '@/components/scroll-to-top';
import { removeSuffix } from '@/helper/str';
import { handleLogout } from '@/helper/logout';
import Loader from '@/components/loader';
import errorImg from '/error.svg';
import { settingsAtom } from '@/stores/settings';
import { ENV } from '@/constants/env';
import { SettingRepo } from '@/repo/setting-repo';

export const DashboardLayout = () => {
    const navigate = useNavigate();
    const [user] = useAtom(sessionAtom);
    const [routes] = useState(ROUTES);

    const [loadingSettings, setLoadingSettings] = useState(true);
    const [_, setSettings] = useAtom(settingsAtom);
    const [message, setMessage] = useState('');
    const [count, setCount] = useState(0);

    const defaultPage = useMemo(() => routes[0].link, [routes]);

    const blocker = useBlocker(({ historyAction, currentLocation, nextLocation }) => {
        return (
            historyAction === 'POP' && currentLocation.pathname === defaultPage && nextLocation.pathname !== defaultPage
        );
    });

    useEffect(() => {
        if (blocker.state !== 'blocked') return;
        handleLogout();
    }, [blocker]);

    useEffect(() => {
        let location = window.location.pathname;
        if (!user) {
            const url = location !== '/' ? `/login?${new URLSearchParams({ to: location }).toString()}` : `/login`;
            navigate(url, { replace: true });
            return;
        }
        if (defaultPage === '/') return;

        const isRoot = removeSuffix(location, '/') === ENV.BASE_URL;
        if (isRoot) navigate(defaultPage, { replace: true });
    }, [user]);

    useEffect(() => {
        if (!user) return;
        (async () => {
            setLoadingSettings(true);
            const { data, error } = await SettingRepo.getSetting(user.user.id);
            setLoadingSettings(false);
            if (error) {
                setMessage(error.message);
                return;
            }
            if (!data) {
                setMessage('Something went wrong, please try again');
                return;
            }
            setSettings(data);
        })();
    }, [user, count]);

    if (!user) return null;
    if (loadingSettings || message)
        return (
            <div className="grid min-h-dvh place-items-center">
                {loadingSettings ? (
                    <Loader />
                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <img className="h-64" src={errorImg} alt="" />
                        <span className="text-xl font-semibold">{message}</span>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => setCount((prev) => prev + 1)} className="dai-btn dai-btn-primary">
                                Try again
                            </button>
                            <button onClick={handleLogout} className="dai-btn dai-btn-ghost underline">
                                Relogin
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );

    return (
        <div className="flex min-h-dvh flex-col items-center bg-base-200 text-base-content">
            <ScrollToTop />
            <AppBar />
            <main className="grid w-full flex-1 px-2 md:w-[47rem]">
                <Routes>
                    {routes.map((el) => (
                        <Route path={el.link + (el.layout ? '/*' : '')} element={<el.el />} key={el.link} />
                    ))}
                    <Route path="*" element={<NotFound home={defaultPage} />} />
                </Routes>
            </main>
            <MobileNavbar routes={routes} />
        </div>
    );
};
