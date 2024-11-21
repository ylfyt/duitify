import { closeModal, modalAtom } from '@/stores/modal';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

interface ModalContainerProps {}

const ModalContainer: FC<ModalContainerProps> = ({}) => {
    const [modals] = useAtom(modalAtom);
    const blocker = useBlocker(modals.length > 0);

    const popModal = () => {
        if (modals.length === 0) return;
        if (!modals[modals.length - 1].dismissible) return;

        closeModal();
    };

    useEffect(() => {
        window.addEventListener('keyup', handleEsc);
        return () => window.removeEventListener('keyup', handleEsc);
    }, []);

    const handleEsc = (e: KeyboardEvent) => {
        if (e.key !== 'Escape') return;
        popModal();
    };

    useEffect(() => {
        const onBack = () => {
            if (blocker.state !== 'blocked') return;
            popModal();
        };
        window.addEventListener('popstate', onBack);
        return () => window.removeEventListener('popstate', onBack);
    }, [blocker]);

    return (
        <div
            onClick={popModal}
            className="fixed left-0 top-0 z-30 flex min-h-dvh w-full items-center justify-center bg-black bg-opacity-60 sm:items-center"
        >
            {...modals.map((el, idx) => {
                return (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        key={idx}
                        hidden={idx !== modals.length - 1}
                        className="absolute w-full px-3 sm:w-fit sm:px-0"
                    >
                        <el.Element {...el.props} isOpen={idx === modals.length - 1} />
                    </div>
                );
            })}
        </div>
    );
};

interface GlobalModalProps {}
export const GlobalModal: FC<GlobalModalProps> = () => {
    const [modals] = useAtom(modalAtom);
    useEffect(() => {
        if (modals.length === 0) {
            document.body.style.overflowY = 'auto';
            return;
        }
        document.body.style.overflowY = 'hidden';
    }, [modals]);
    return modals.length === 0 ? null : <ModalContainer />;
};
