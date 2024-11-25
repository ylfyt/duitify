import { ROUTES } from '@/constants/routes';
import { removePrefix } from '@/helper/str';
import { userAtom } from '@/stores/auth';
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
    const [user, setUser] = useAtom(userAtom);

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
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="flex w-80 flex-col items-center gap-6 rounded-xl bg-base-100 p-6 shadow-md"
            >
                <h2 className="text-center text-2xl">Login</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="dai-input dai-input-bordered w-full"
                    required
                />
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="dai-input dai-input-bordered w-full"
                    required
                />
                <LoadingButton disabled={disabled} loading={loading} className="dai-btn-primary">
                    Submit
                </LoadingButton>
            </form>
        </div>
    );
};

export default LoginPage;
