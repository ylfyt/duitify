import { FC, useEffect, useRef } from 'react';
import { Icon, IconName } from '@/components/icon';
import { NavLink } from 'react-router-dom';
import { Route as Menu } from '@/types/routes';
import { useStateWithRef } from '@/hooks/use-state-with-ref';

interface MobileNavbarItemProps {
    icon: IconName;
    title: string;
    href: string;
}

export const MobileNavbarItem: FC<MobileNavbarItemProps> = ({ icon, title, href }) => {
    return (
        <NavLink
            to={href}
            className={({ isActive }) => {
                return [
                    'group flex w-[4rem] flex-col items-center rounded-2xl px-3 py-1 transition-all duration-300 xs:w-[5rem]',
                    isActive ? 'is-active bg-secondary/10 font-semibold text-secondary' : '',
                ].join(' ');
            }}
        >
            <Icon icon={icon} className="text-xl xs:text-2xl" />
            <span className="hidden text-center text-xxs group-[.is-active]:block xs:text-xs">{title}</span>
        </NavLink>
    );
};

interface MobileNavbarProps {
    routes: Menu[];
}

export const MobileNavbar: FC<MobileNavbarProps> = ({ routes }) => {
    const [show, setShow, showRef] = useStateWithRef(true);
    const lastScrollRef = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.scrollY;
            if (scroll <= 0) {
                setShow(true);
                return;
            }
            if (scroll > lastScrollRef.current && showRef.current) {
                // down
                setShow(false);
            } else if (scroll < lastScrollRef.current && !showRef.current) {
                // up
                setShow(true);
            }
            lastScrollRef.current = scroll;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <div
                className={`${show ? 'transform-none' : 'translate-y-full'} fixed bottom-0 left-0 z-20 grid h-16 w-full place-items-center bg-base-100 shadow-t-md transition-transform`}
            >
                <div className="flex w-full items-center justify-evenly py-1 md:w-[47rem]">
                    {routes.map((el, idx) => (
                        <MobileNavbarItem key={idx} href={el.link} title={el.title} icon={el.icon} />
                    ))}
                </div>
            </div>
        </div>
    );
};
