import { globalLoadingAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FunctionComponent } from 'react';
import Loader from './loader';

interface GlobalLoadingProps {}

const GlobalLoading: FunctionComponent<GlobalLoadingProps> = () => {
    const [loading, _] = useAtom(globalLoadingAtom);

    return loading ? (
        <div className="fixed left-0 top-0 z-50 grid h-dvh w-full place-items-center bg-black bg-opacity-40">
            <Loader />
        </div>
    ) : null;
};

export default GlobalLoading;
