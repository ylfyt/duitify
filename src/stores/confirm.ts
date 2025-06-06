import { closeModal, openModal } from '@/components/global-modal';
import { ModalConfirm } from '@/components/modal-confirm';

type ConfirmOptions = {
    title?: string;
    body?: string;
    okText?: string;
    noText?: string;
    hideNo?: boolean;
};

export function showConfirm(opts: ConfirmOptions = {}) {
    return new Promise<boolean>((resolve) => {
        const id = openModal(ModalConfirm, {
            onClose: () => resolve(false),
            onOk: () => {
                resolve(true);
                closeModal();
            },
            onNo: () => {
                resolve(false);
                closeModal();
            },
            ...opts,
        });
        if (id === -1) resolve(false); // already exist
    });
}
