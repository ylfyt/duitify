import { FC, useEffect } from 'react';
import { Modal } from './modal';

type ModalConfirmProps = JSX.IntrinsicAttributes & {
    title?: string;
    body?: string;
    okText?: string;
    noText?: string;
    onOk?: () => void;
    onNo?: () => void;
    onClose?: () => void;
    hideNo?: boolean;
};

export const ModalConfirm: FC<ModalConfirmProps> = ({ title, body, okText, noText, onNo, onOk, onClose, hideNo }) => {
    useEffect(() => {
        return () => {
            onClose?.();
        };
    }, []);

    return (
        <Modal title={title ?? 'Konfirmasi'}>
            {body && <p className="py-2">{body}</p>}
            <div className="mt-2 flex w-full justify-end gap-2">
                {!hideNo && (
                    <button onClick={onNo} className="dai-btn dai-btn-ghost">
                        {noText ?? 'Batal'}
                    </button>
                )}
                <button onClick={onOk} className="dai-btn dai-btn-primary min-w-16">
                    {okText ?? 'OK'}
                </button>
            </div>
        </Modal>
    );
};
