import { useAutoFocus } from '@/hooks/use-auto-focus';
import { FC, useEffect } from 'react';
import { Icon } from './icon';
import { closeModal } from '@/stores/modal';

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
            <div className="flex items-center justify-between">
                {title && <h3 className="text-lg font-bold">{title}</h3>}
                <button type="button" onClick={() => closeModal()}>
                    <Icon icon="lucide:x" />
                </button>
            </div>
            {children}
        </div>
    );
};

interface ModalWithResultProps {
    modalId?: number;
    onClose?: (modalId?: number) => void;
}

export const ModalWithResult: FC<ModalWithResultProps> = ({ modalId, onClose }) => {
    useEffect(() => {
        return () => onClose?.(modalId);
    }, [modalId, onClose]);

    return (
        <Modal>
            <div>
                <h1>{modalId}</h1>
                <button onClick={() => closeModal(modalId)}>close</button>
            </div>
        </Modal>
    );
};
