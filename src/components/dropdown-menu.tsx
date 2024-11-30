import { FC } from 'react';
import { Icon, IconName } from './icon';

export type DropdownMenuOption = {
    icon: IconName;
    label: string;
    onClick: () => void;
    style?: string;
};

interface DropdownMenuProps {
    options: DropdownMenuOption[];
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ options }) => {
    return (
        <div className="dai-dropdown dai-dropdown-end dai-dropdown-left">
            <div tabIndex={0} role="button" className="dai-btn dai-btn-ghost dai-btn-xs">
                <Icon icon="lucide:more-vertical" />
            </div>
            <ul
                tabIndex={0}
                className="dai-menu dai-dropdown-content z-[29] w-64 rounded-box border-[2px] border-base-200 bg-base-100 p-2 shadow-all-lg"
            >
                {options.map((el, idx) => (
                    <li key={idx}>
                        <button className={'font-semibold ' + el.style} onClick={el.onClick}>
                            <Icon className="text-lg" icon={el.icon} />
                            {el.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
