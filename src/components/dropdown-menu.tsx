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
    disabled?: boolean;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ options, disabled }) => {
    return (
        <div className="dai-dropdown dai-dropdown-end dai-dropdown-bottom">
            <div
                tabIndex={0}
                role="button"
                onClick={(e) => e.stopPropagation()}
                className={'dai-btn dai-btn-ghost dai-btn-xs ' + (disabled ? 'dai-btn-disabled' : '')}
            >
                <Icon icon="lucide:more-vertical" />
            </div>
            <ul
                tabIndex={0}
                className="dai-menu dai-dropdown-content z-[29] w-64 rounded-box border-[2px] border-base-200 bg-base-100 p-2 shadow-all-lg"
            >
                {options.map((el, idx) => (
                    <li key={idx}>
                        <button
                            className={'font-semibold ' + el.style}
                            onClick={(e) => {
                                e.stopPropagation();
                                el.onClick();
                                e.currentTarget.blur();
                            }}
                        >
                            <Icon className="text-lg" icon={el.icon} />
                            {el.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
