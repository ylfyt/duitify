import { FC } from 'react';

interface SkeletonProps {
    children: React.ReactNode;
    className?: string;
}

const Skeleton: FC<SkeletonProps> = ({ children, className }) => {
    return (
        <div className={'dai-skeleton w-fit ' + className}>
            <div className="invisible">{children}</div>
        </div>
    );
};

export default Skeleton;

interface CondSkeletonProps {
    skel?: boolean;
    children: React.ReactNode;
    placeholder?: React.ReactNode;
}

export const CondSkeleton: FC<CondSkeletonProps> = ({ skel, children, placeholder }) => {
    return skel ? <Skeleton>{placeholder ?? children}</Skeleton> : children;
};
