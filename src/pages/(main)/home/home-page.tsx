import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import logoImg from '/vite.svg';
import { Icon } from '@/components/icon';
import { handleLogout } from '@/helper/logout';
import { isDarkAtom } from '@/stores/theme';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
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
            <h1>Home</h1>
        </div>
    );
};

export default HomePage;
