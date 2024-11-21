import { atom, getDefaultStore } from 'jotai';
import { FC } from 'react';

const store = getDefaultStore();

let LAST_ID = 0;

type Modal = {
    Element: FC<any>;
    props: JSX.IntrinsicAttributes;
    dismissible: boolean;
    modalId?: number;
};
const internalModalAtom = atom<Modal[]>([]);
export const modalAtom = atom<Modal[]>((get) => get(internalModalAtom));

export type ModalOptions = {
    dismissible?: boolean;
    modalId?: number;
};
/**
 * Open a modal with the given element and props.
 * It will return the id of the modal.
 * If modal already exist -1 will be returned.
 **/
export function openModal<T>(
    element: FC<T>,
    { dismissible = true, ...props }: T & JSX.IntrinsicAttributes & ModalOptions,
): number {
    if (props.modalId) {
        const exist = store.get(internalModalAtom).find((modal) => modal.modalId === props.modalId);
        if (exist) return -1;
    }

    if (!props.modalId) props.modalId = ++LAST_ID as any;

    store.set(internalModalAtom, (modals) => [
        ...modals,
        { Element: element, props, dismissible, modalId: props.modalId },
    ]);
    return props.modalId ?? 0;
}

/**
 * Close the last modal in the stack.
 **/
export function closeModal(id?: number) {
    store.set(internalModalAtom, (modals) => {
        if (!id) modals.pop();
        else modals = modals.filter((modal) => modal.modalId !== id);

        return [...modals];
    });
}

/**
 * Close all modals in the stack.
 **/
export function closeAllModals() {
    store.set(internalModalAtom, []);
}
