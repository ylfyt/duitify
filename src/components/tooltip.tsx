import { FC, useEffect, useMemo, useRef, useState } from 'react';

interface TooltipProps {
    children: (ref: React.RefObject<any>) => React.ReactNode;
    text: string;
    open?: boolean;
}

export const Tooltip: FC<TooltipProps> = ({ open, children, text }) => {
    const ref = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement | undefined>(undefined);

    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const show = useMemo(() => open || isHovered || isFocused, [open, isHovered, isFocused]);

    useEffect(() => {
        if (!ref.current) return;

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);
        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        ref.current.addEventListener('mouseenter', handleMouseEnter);
        ref.current.addEventListener('mouseleave', handleMouseLeave);
        ref.current.addEventListener('focus', handleFocus);
        ref.current.addEventListener('blur', handleBlur);

        return () => {
            ref.current?.removeEventListener('mouseenter', handleMouseEnter);
            ref.current?.removeEventListener('mouseleave', handleMouseLeave);
            ref.current?.removeEventListener('focus', handleFocus);
            ref.current?.removeEventListener('blur', handleBlur);
        };
    }, [ref.current]);

    useEffect(() => {
        return () => {
            tooltipRef.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (!tooltipRef.current) return;
        tooltipRef.current.innerText = text;
    }, [text, tooltipRef.current]);

    useEffect(() => {
        tooltipRef.current?.remove();
        tooltipRef.current = undefined;

        if (!show || !ref.current) return;

        const div = document.createElement('div');
        const { top, left } = getCenter(ref.current);
        div.style.top = `${top}px`;
        div.style.left = `${left}px`;

        div.className = 'tooltip';
        div.innerText = text;
        document.body.appendChild(div);
        tooltipRef.current = div;
    }, [show, ref.current]);

    const getCenter = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.left + rect.width / 2 };
    };

    return children(ref);
};
