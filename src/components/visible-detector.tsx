import React, { FC, useEffect, useRef, useState } from 'react';

interface VisibleDetectorProps {
    children: React.ReactNode;
    onVisible?: () => void;
    onInvisible?: () => void;
    offset?: number; // by default is 75, based on bottom navigation bar height
}

export const VisibleDetector: FC<VisibleDetectorProps> = ({ children, onInvisible, onVisible, offset = 0 }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isVisible) {
            onVisible?.();
            return;
        }
        onInvisible?.();
    }, [isVisible]);

    useEffect(() => {
        if (!ref.current) return;

        let prevState: boolean | undefined;

        function checkVisible() {
            const elm = ref.current;
            if (!elm) return;
            const rect = elm.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight) - offset;
            const currVis = !(rect.bottom < 0 || rect.top - viewHeight >= 0);

            if (currVis !== prevState) {
                setIsVisible(currVis);
            }
            prevState = currVis;
        }
        checkVisible();

        window.addEventListener('scroll', checkVisible);
        return () => {
            window.removeEventListener('scroll', checkVisible);
        };
    }, [ref, offset]);

    return <div ref={ref}>{children}</div>;
};
