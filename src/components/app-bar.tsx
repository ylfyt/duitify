import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, Fragment, useEffect, useState } from 'react';
import { Icon } from '@/components/icon';
import { revealAmountAtom, settingsAtom } from '@/stores/settings';

const SCROLL_THRESHOLD = 8;

interface AppBarProps {}

export const AppBar: FC<AppBarProps> = () => {
    const [appBarCtx] = useAtom(appBarCtxAtom);
    const [scrolled, setScrolled] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    const [settings] = useAtom(settingsAtom);
    const [reveal, setReveal] = useAtom(revealAmountAtom);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (scrollY <= SCROLL_THRESHOLD && scrolled) return setScrolled(false);
        if (scrollY > SCROLL_THRESHOLD && !scrolled) return setScrolled(true);
    }, [scrollY]);

    return (
        <div>
            <div
                className={
                    'fixed left-0 top-0 z-20 grid h-16 w-full place-items-center bg-secondary text-secondary-content shadow-md ' +
                    (scrolled ? 'opacity-90' : '')
                }
            >
                <div className="flex w-full items-center justify-between px-6 lg:w-[50rem]">
                    <div className="flex items-center gap-4 text-3xl">
                        {appBarCtx.back && (
                            <button onClick={() => history.back()} className="flex items-center gap-4 text-3xl">
                                <Icon icon="mdi:arrow-left" />
                            </button>
                        )}
                        {!appBarCtx.title ? null : typeof appBarCtx.title !== 'string' ? (
                            appBarCtx.title
                        ) : (
                            <span className="text-xl font-semibold">{appBarCtx.title}</span>
                        )}
                        {appBarCtx.leftActions?.map((el, idx) => <Fragment key={idx}>{el}</Fragment>)}
                    </div>
                    <div className="flex items-center gap-4 text-3xl">
                        {settings?.hide_amount && appBarCtx.revealer && (
                            <button onClick={() => setReveal((prev) => !prev)} className="text-2xl">
                                {!reveal ? <Icon icon="lucide:eye-off" /> : <Icon icon="lucide:eye" />}
                            </button>
                        )}
                        {appBarCtx.actions?.map((el, idx) => <Fragment key={idx}>{el}</Fragment>)}
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    );
};
