import { ROUTES } from '@/constants/routes';
import { removePrefix } from '@/helper/str';
import { sessionAtom } from '@/stores/auth';
import { useAtom } from 'jotai';
import { FC, useDeferredValue, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase';
import { toast } from 'react-toastify';
import { ENV } from '@/constants/env';
import { LoadingButton } from '@/components/loading-button';

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = () => {
    const navigate = useNavigate();
    const [user, setUser] = useAtom(sessionAtom);

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const disabled = useDeferredValue(!email || !password);

    useEffect(() => {
        if (!user) return;

        let target = new URLSearchParams(window.location.search).get('to');
        if (target) target = removePrefix(target, ENV.BASE_URL);

        const url = target ?? ROUTES[0].link;
        navigate(url);
    }, [user]);

    const handleSigninWithGoogle = async () => {
        const res = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (res.error) {
            toast.error(res.error.message);
            return;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const { error, data } = await supabase.auth.signInWithPassword({ email: email, password });
        setLoading(false);
        if (error) {
            toast.error(error.message);
            return;
        }
        setUser(data.session);
    };

    return (
        <div className="flex min-h-dvh items-center justify-center">
            <div className="flex w-80 flex-col items-center gap-4 rounded-xl border border-base-300 bg-base-100 p-6 shadow-md">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex w-full flex-col items-center gap-4"
                >
                    <h2 className="text-center text-2xl font-medium">Login</h2>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="dai-input dai-input-sm dai-input-bordered w-full xs:dai-input-md"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="dai-input dai-input-sm dai-input-bordered w-full xs:dai-input-md"
                        required
                    />
                    <LoadingButton size="sm" disabled={disabled} loading={loading} className="dai-btn-primary">
                        Submit
                    </LoadingButton>
                </form>
                <span className="flex w-full items-center gap-2 text-sm">
                    <hr className="flex-1 border-base-300" />
                    <span>OR</span>
                    <hr className="flex-1 border-base-300" />
                </span>
                <div>
                    <button
                        disabled
                        onClick={handleSigninWithGoogle}
                        className="dai-btn dai-btn-primary dai-btn-sm dai-btn-wide"
                    >
                        Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
