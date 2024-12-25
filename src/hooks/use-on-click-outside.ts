import { useEffect } from 'react';

type EventType = MouseEvent | TouchEvent;

export const useOnClickOutside = (
    ref: React.RefObject<HTMLElement>,
    handler: (event: EventType) => void,
    excludes?: React.RefObject<HTMLElement>[],
) => {
    useEffect(() => {
        const listener = (event: EventType) => {
            // Check if the click is outside the ref's current element
            if (
                !ref.current ||
                ref.current.contains(event.target as Node) ||
                excludes?.some((el) => el.current?.contains(event.target as Node))
            ) {
                return;
            }
            handler(event);
        };

        // Attach the event listeners
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        // Cleanup on unmount
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler, excludes]); // Re-run the effect if ref or handler changes
};
