import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import logoImg from '/vite.svg';
import { Icon } from '@/components/icon';
import { handleLogout } from '@/helper/logout';

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    useEffect(() => {
        setAppBarCtx({
            title: <img src={logoImg} alt="Logo" />,
            actions: [
                <button className="dai-btn dai-btn-error dai-btn-sm text-lg" onClick={handleLogout}>
                    <Icon icon="lucide:log-out" />
                </button>,
            ],
            hideDefaultAction: true,
        });
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
            <h1>Home</h1>
        </div>
    );
};

export default HomePage;
