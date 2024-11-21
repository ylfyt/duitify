import { useEffect, useRef } from 'react';

const focusable: (keyof HTMLElementTagNameMap)[] = ['input', 'textarea', 'button', 'a', 'select', 'label'];

export function useAutoFocus<T extends HTMLElement>(): React.RefObject<T> {
    const focusRef = useRef<T>(null);
    useEffect(() => {
        if (!focusRef.current) return;

        const tag = focusRef.current.tagName.toLowerCase() as keyof HTMLElementTagNameMap;
        if (focusable.includes(tag)) {
            focusRef.current.focus();
            return;
        }

        for (const el of focusable) {
            const res = focusRef.current.querySelectorAll(el);
            if (res.length === 0) continue;
            res[0].focus();
            return;
        }
    }, [focusRef]);
    return focusRef;
}
