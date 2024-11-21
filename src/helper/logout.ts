import { showLoading } from '@/stores/common';
import { showConfirm } from '@/stores/confirm';
import { delay } from './delay';

export const handleLogout = async () => {
    const confirmed = await showConfirm({
        body: 'Apakah anda yakin ingin keluar?',
        title: 'Logout',
        okText: 'Logout',
    });
    if (!confirmed) return;

    showLoading(true);
    await delay(3000);
    showLoading(false);
};
