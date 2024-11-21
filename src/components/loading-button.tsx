import React, { FC, useMemo } from 'react';

const buttonSizeMap = {
    xs: 'dai-btn-xs',
    sm: 'dai-btn-sm',
    md: 'dai-btn-md',
    lg: 'dai-btn-lg',
    wide: 'dai-btn-wide',
    block: 'dai-btn-block'
};

const loadingSizeMap = {
    xs: 'dai-loading-xs',
    sm: 'dai-loading-sm',
    md: 'dai-loading-md',
    lg: 'dai-loading-lg',
    wide: 'dai-loading-md',
    block: 'dai-loading-md'
};

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    loading?: boolean;
    disableWhileLoading?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'wide' | 'block';
}

export const LoadingButton: FC<LoadingButtonProps> = ({
    children,
    loading,
    className,
    disabled,
    size = 'md',
    disableWhileLoading = true,
    ...buttonProps
}) => {
    const buttonSize = useMemo((): string => buttonSizeMap[size], [size]);
    const loadingSize = useMemo((): string => loadingSizeMap[size], [size]);

    return (
        <button
            disabled={disabled || (disableWhileLoading && loading)}
            className={`dai-btn relative grid place-items-center ${className} ${buttonSize}`}
            {...buttonProps}
        >
            <span className={`${loading ? 'opacity-0' : ''}`}>{children}</span>
            {loading && <span className={`dai-loading dai-loading-spinner absolute ${loadingSize}`}></span>}
        </button>
    );
};
