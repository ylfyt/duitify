import { FC } from 'react';
import { Icon, IconName } from '@/components/icon';
import { NavLink } from 'react-router-dom';
import { Route as Menu } from '@/types/routes';

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
    return (
        <div>
            <div className="fixed bottom-0 left-0 z-20 grid h-16 w-full place-items-center bg-base-100 shadow-t-md">
                <div className="flex w-full items-center justify-evenly py-1 md:w-[47rem]">
                    {routes.map((el, idx) => (
                        <MobileNavbarItem key={idx} href={el.link} title={el.title} icon={el.icon} />
                    ))}
                </div>
            </div>
            <div className="h-20"></div>
        </div>
    );
};
