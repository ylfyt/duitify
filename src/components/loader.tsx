import { FC } from 'react';

interface LoaderProps {}

const Loader: FC<LoaderProps> = () => {
    return (
        <div className="relative grid place-items-center">
            <span className="fixed size-20 animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-primary border-t-primary"></span>
            <span className="fixed size-16 animate-reverse-spin rounded-full border-4 border-b-transparent border-l-warning border-r-transparent border-t-warning"></span>
            <span className="fixed size-12 animate-spin rounded-full border-4 border-b-primary border-l-primary border-r-transparent border-t-transparent"></span>
        </div>
    );
};

export default Loader;
