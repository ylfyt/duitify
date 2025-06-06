import { atom, getDefaultStore, useAtom } from 'jotai';
import { FC, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const store = getDefaultStore();
const MODAL_SEARCH_KEY = 'modal-depth';
let LAST_ID = 0;

type Modal = {
    Element: FC<any>;
    props: JSX.IntrinsicAttributes;
    dismissible: boolean;
    modalId?: number;
};

export type ModalOptions = {
    dismissible?: boolean;
    modalId?: number;
};
/**
 * Open a modal with the given element and props.
 * It will return the id of the modal.
 * If modal already exist, them -1 will be returned.
 **/
export function openModal<T>(
    element: FC<T>,
    { dismissible = true, ...props }: T & JSX.IntrinsicAttributes & ModalOptions,
): number {
    if (props.modalId) {
        const exist = store.get(pendingModalAtom).find((modal) => modal.modalId === props.modalId);
        if (exist) return -1;
    }

    if (!props.modalId) props.modalId = ++LAST_ID as any;

    store.set(pendingModalAtom, (prev) => {
        prev.push({ Element: element, props, dismissible, modalId: props.modalId });
        return [...prev];
    });
    return props.modalId ?? 0;
}

/**
 * Close the last modal in the stack.
 **/
export function closeModal() {
    history.back();
}

const pendingModalAtom = atom<Modal[]>([]);
const modalAtom = atom<Modal[]>([]);

export const GlobalModal: FC<{}> = ({}) => {
    const [modals, setModals] = useAtom(modalAtom);
    const [pending, setPending] = useAtom(pendingModalAtom);

    const [search, setSearch] = useSearchParams();
    const depth = useMemo(() => {
        const d = parseInt(search.get(MODAL_SEARCH_KEY) || '0', 10);
        return isNaN(d) ? 0 : d;
    }, [search.get(MODAL_SEARCH_KEY)]);

    useEffect(() => {
        if (pending.length === 0) return;

        setModals((prev) => {
            prev.push(...pending);
            setPending([]);

            const isExists = !!new URLSearchParams(window.location.search).get(MODAL_SEARCH_KEY);
            setSearch(
                (s) => {
                    s.set(MODAL_SEARCH_KEY, prev.length.toString());
                    return s;
                },
                { replace: prev.length === 1 && isExists },
            );

            return [...prev];
        });
    }, [pending]);

    useEffect(() => {
        if (modals.length <= depth) return;
        setModals((prev) => prev.slice(0, depth));
    }, [depth]);

    useEffect(() => {
        if (modals.length === 0) {
            document.body.style.overflowY = 'auto';
            return;
        }
        document.body.style.overflowY = 'hidden';
    }, [modals]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            popModal();
        };
        window.addEventListener('keyup', handleEsc);
        return () => window.removeEventListener('keyup', handleEsc);
    }, []);

    const popModal = () => {
        if (modals.length === 0) return;
        if (!modals[modals.length - 1].dismissible) return;

        closeModal();
    };

    if (modals.length === 0) return null;
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
