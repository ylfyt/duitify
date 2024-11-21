import { userAtom } from '@/stores/auth';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterPageProps {}

export const RegisterPage: FC<RegisterPageProps> = () => {
    const [user] = useAtom(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const target = new URLSearchParams(window.location.search).get('to');
        const url = target ?? '/';
        navigate(url);
    }, [user]);

    return <h1>Register</h1>;
};
