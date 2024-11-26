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

const DEFAULT = '';

export const DashboardLayout = () => {
    const navigate = useNavigate();
    const [user] = useAtom(sessionAtom);
    const [routes] = useState(ROUTES);

    const blocker = useBlocker(({ historyAction, currentLocation, nextLocation }) => {
        return (
            historyAction === 'POP' &&
            currentLocation.pathname === ROUTES[0].link &&
            nextLocation.pathname !== ROUTES[0].link
        );
    });

    const defaultPage = useMemo(() => (!DEFAULT ? routes[0].link : DEFAULT), [routes]);

    useEffect(() => {
        if (blocker.state !== 'blocked') return;
        handleLogout();
    }, [blocker]);

    useEffect(() => {
        if (user) {
            if (defaultPage !== '/') {
                let isRoot = false;
                if (import.meta.env.BASE_URL === '/' && window.location.pathname === '/') isRoot = true;
                if (
                    import.meta.env.BASE_URL !== '/' &&
                    removeSuffix(window.location.pathname, '/') === import.meta.env.BASE_URL
                )
                    isRoot = true;

                if (isRoot) navigate(defaultPage, { replace: true });
            }
            return;
        }
        const url =
            window.location.pathname !== '/'
                ? `/login?${new URLSearchParams({ to: window.location.pathname }).toString()}`
                : `/login`;
        navigate(url, { replace: true });
    }, [user]);

    if (!user) return null;
    return (
        <div className="flex min-h-dvh flex-col items-center bg-base-200 text-base-content">
            <ScrollToTop />
            <AppBar />
            <main className="grid w-full flex-1 px-4 lg:w-[50rem]">
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
