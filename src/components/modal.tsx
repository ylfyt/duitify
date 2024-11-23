import { useAutoFocus } from '@/hooks/use-auto-focus';
import { FC } from 'react';

type ModalProps = {
    children: React.ReactNode;
    title?: string;
    useFocus?: boolean;
    className?: string;
};

export const Modal: FC<ModalProps> = ({ children, title, useFocus = true, className }) => {
    const focusRef = useAutoFocus<HTMLDivElement>();
    return (
        <div
            ref={!useFocus ? undefined : focusRef}
            className={
                'flex flex-col gap-1 rounded-2xl bg-base-100 p-6 shadow-xl sm:min-w-[30rem] sm:rounded-2xl' +
                ' ' +
                className
            }
        >
            {title && <h3 className="text-lg font-bold">{title}</h3>}
            {children}
        </div>
    );
};
