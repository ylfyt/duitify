import MainLayout from './pages/_layout';
import GlobalLoading from './components/global-loading';
import { useEffect, useState } from 'react';
import Loader from './components/loader';
import { sessionAtom } from './stores/auth';
import { GlobalModal } from './components/global-modal';
import { useAtom } from 'jotai';
import { themeNameAtom } from './stores/theme';
import { ToastContainer } from 'react-toastify';
import errorImg from '/error.svg';
import { supabase } from './supabase';

function App() {
    const [themeName] = useAtom(themeNameAtom);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    const [, setUser] = useAtom(sessionAtom);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeName);
    }, [themeName]);

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        setLoading(true);
        setFailed(false);

        const { error, data } = await supabase.auth.getSession();

        if (error) {
            setLoading(false);
            setFailed(true);
            return;
        }
        setUser(data.session);
        setLoading(false);
    };

    return (
        <>
            {!loading && !failed ? (
                <MainLayout />
            ) : loading ? (
                <div className="grid min-h-dvh w-full place-items-center">
                    <Loader />
                </div>
            ) : failed ? (
                <div className="grid min-h-dvh w-full place-items-center">
                    <div className="flex flex-col items-center gap-6">
                        <img className="h-64" src={errorImg} alt="" />
                        <span className="text-xl font-semibold">It's looks like something went wrong</span>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => getUserInfo()} className="dai-btn dai-btn-primary">
                                Try again
                            </button>
                            <button
                                onClick={() => {
                                    setFailed(false);
                                }}
                                className="dai-btn dai-btn-ghost underline"
                            >
                                Relogin
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
            <ToastContainer position="top-center" theme={themeName} />
            <GlobalModal />
            <GlobalLoading />
        </>
    );
}

export default App;
