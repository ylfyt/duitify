import { ENV } from '@/constants/env';
import { showLoading } from '@/stores/common';
import { showConfirm } from '@/stores/confirm';
import { supabase } from '@/supabase';
import { removePrefix } from './str';

export const handleLogout = async () => {
    const confirmed = await showConfirm({
        body: 'Are you sure want to logout?',
        title: 'Logout',
        okText: 'Logout',
    });
    if (!confirmed) return;

    showLoading(true);
    const { error } = await supabase.auth.signOut();
    showLoading(false);
    console.error(error);

    const PROJECT_ID = removePrefix(ENV.SUPABASE_PROJECT_URL, 'https://').split('.')[0];
    localStorage.removeItem(`sb-${PROJECT_ID}-auth-token`);
    window.location.href = ENV.BASE_URL + '/login';
};
