import { ROUTES } from '@/constants/routes';
import { removePrefix } from '@/helper/str';
import { userAtom } from '@/stores/auth';
import { useAtom } from 'jotai';
import { FC, useDeferredValue, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase';
import { toast } from 'react-toastify';

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
        if (target) {
            target = removePrefix(target, import.meta.env.BASE_URL);
            if (!target.startsWith('/')) target = `/${target}`;
        }

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
        <div className="flex min-h-dvh items-center justify-center bg-base-200">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="w-80 space-y-6 rounded bg-base-100 p-6 shadow-md"
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
                <button
                    disabled={disabled || loading}
                    type="submit"
                    className="w-full rounded bg-blue-500 p-2 text-white transition duration-200 hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Please wait' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
