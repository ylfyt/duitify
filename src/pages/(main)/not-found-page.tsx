import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NotFoundProps {
    home: string;
}

export const NotFound: FC<NotFoundProps> = ({ home }) => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);

    useEffect(() => {
        setAppBarCtx({
            title: 'Not found',
            icon: 'lucide:circle-alert',
        });
    }, []);

    return (
        <div className="grid flex-1 place-items-center">
            <div className="flex flex-col items-center gap-10">
                <div className="text-center">
                    <p className="text-3xl font-bold">404 | Not Found</p>
                    <p>Sorry, the page you are looking for does not exist.</p>
                </div>
                <Link replace to={home} className="dai-btn dai-btn-primary dai-btn-sm dai-btn-wide">
                    Back to home
                </Link>
            </div>
        </div>
    );
};
