import { showLoading } from '@/stores/common';
import { showConfirm } from '@/stores/confirm';
import { supabase } from '@/supabase';
import { toast } from 'react-toastify';

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
    if (error) {
        toast.error(error.message);
        return;
    }

    let newLoc = '/login';
    if (import.meta.env.BASE_URL !== '/') newLoc = import.meta.env.BASE_URL + newLoc;
    window.location.href = newLoc;
};
