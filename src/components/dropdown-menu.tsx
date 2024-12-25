import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { FC, useEffect, useRef, useState } from 'react';
import { Icon, IconName } from './icon';

const SCREEN_OFFSET = 160;

export type DropdownMenuOption = {
    icon: IconName;
    label: string;
    onClick?: () => void;
    style?: string;
};

interface DropdownMenuProps {
    icon?: IconName;
    disabled?: boolean;
    options: DropdownMenuOption[];
    position?: 'top' | 'bottom';
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ icon, disabled, options, position = 'bottom' }) => {
    const [show, setShow] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    const [info, setInfo] = useState<{ top: number; left: number; offset: 'top' | 'bottom' }>();

    useOnClickOutside(toggleRef, () => {
        if (!show) return;
        setShow(false);
    }, [menuRef]);

    useEffect(() => {
        if (!show || !toggleRef.current) {
            setInfo(undefined);
            return;
        }

        const toggleRect = toggleRef.current.getBoundingClientRect();
        const offset =
            toggleRect.top <= SCREEN_OFFSET
                ? 'bottom'
                : window.innerHeight - toggleRect.top <= SCREEN_OFFSET
                  ? 'top'
                  : position;
        const top = offset === 'bottom' ? toggleRect.top + toggleRect.height : toggleRect.top;

        setInfo({
            top,
            offset,
            left: toggleRect.left + toggleRect.width,
        });
    }, [show, toggleRef.current, position]);

    return (
        <div>
            <button
                ref={toggleRef}
                type="button"
                disabled={disabled || !options.length}
                className="dai-btn dai-btn-ghost dai-btn-sm text-base"
                onClick={(e) => {
                    setShow((prev) => !prev);
                    e.stopPropagation();
                }}
            >
                <Icon icon={icon ?? 'lucide:more-vertical'} />
            </button>
            {info && (
                <ul
                    ref={menuRef}
                    style={{
                        top: info.top,
                        left: info.left,
                        position: 'fixed',
                    }}
                    className={
                        'dai-menu z-[29] w-56 -translate-x-full rounded-box border-[2px] border-base-200 bg-base-100 shadow-all-lg ' +
                        (info.offset === 'top' ? '-translate-y-full' : '')
                    }
                >
                    {options.map((el, idx) => (
                        <li key={idx}>
                            <button
                                className={'font-semibold ' + el.style}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    el.onClick?.();
                                    setShow(false);
                                }}
                            >
                                <Icon className="text-lg" icon={el.icon} />
                                {el.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
