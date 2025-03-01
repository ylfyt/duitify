import React from 'react';

function isTouchEvent({ nativeEvent }: any) {
    return window.TouchEvent ? nativeEvent instanceof TouchEvent : 'touches' in nativeEvent;
}

function isMouseEvent(event: any) {
    return event.nativeEvent instanceof MouseEvent;
}

type Callback = (event: React.MouseEvent | React.TouchEvent) => void;
type Props = {
    threshold?: number;
    onStart?: Callback;
    onFinish?: Callback;
    onCancel?: Callback;
};

export function useLongPress(callback: Callback, options: Props = {}) {
    const { threshold = 400, onStart, onFinish, onCancel } = options;
    const isLongPressActive = React.useRef(false);
    const isPressed = React.useRef(false);
    const timerId = React.useRef<NodeJS.Timeout>();

    return React.useMemo<{
        onMouseDown?: Callback;
        onMouseUp?: Callback;
        onMouseLeave?: Callback;
        onTouchStart?: Callback;
        onTouchEnd?: Callback;
    }>(() => {
        if (typeof callback !== 'function') {
            return {};
        }

        const start: Callback = (event) => {
            if (!isMouseEvent(event) && !isTouchEvent(event)) return;

            if (onStart) {
                onStart(event);
            }

            isPressed.current = true;
            timerId.current = setTimeout(() => {
                callback(event);
                isLongPressActive.current = true;
            }, threshold);
        };

        const cancel: Callback = (event) => {
            if (!isMouseEvent(event) && !isTouchEvent(event)) return;

            if (isLongPressActive.current) {
                if (onFinish) {
                    onFinish(event);
                }
            } else if (isPressed.current) {
                if (onCancel) {
                    onCancel(event);
                }
            }

            isLongPressActive.current = false;
            isPressed.current = false;

            if (timerId.current) {
                window.clearTimeout(timerId.current);
            }
        };

        const mouseHandlers: {
            onMouseDown: Callback;
            onMouseUp: Callback;
            onMouseLeave: Callback;
        } = {
            onMouseDown: start,
            onMouseUp: cancel,
            onMouseLeave: cancel,
        };

        const touchHandlers: {
            onTouchStart: Callback;
            onTouchEnd: Callback;
        } = {
            onTouchStart: start,
            onTouchEnd: cancel,
        };

        return {
            ...mouseHandlers,
            ...touchHandlers,
        };
    }, [callback, threshold, onCancel, onFinish, onStart]);
}
