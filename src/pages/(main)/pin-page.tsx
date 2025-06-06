import { openModal } from '@/components/global-modal';
import ModalPin from '@/components/modal-pin';
import { sha256 } from '@/helper/crypto';
import { showLoading } from '@/stores/common';
import { pinAuthenticatedAtom, settingsAtom } from '@/stores/settings';
import { useAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { toast } from 'react-toastify';

interface PinPageProps {}

const PinPage: FC<PinPageProps> = () => {
    const [settings] = useAtom(settingsAtom);
    const [, setPinAuthenticated] = useAtom(pinAuthenticatedAtom);

    useEffect(() => {
        openPin();
    }, []);

    const openPin = () => {
        openModal(ModalPin, {
            onClose: validate,
            dismissible: false,
        });
    };

    const validate = async (pin: string) => {
        if (!settings?.pin) return;
        showLoading(true);
        const [pinHash, salt] = settings.pin.split(':');
        const realSalt = salt + settings.user_id;
        const hash = await sha256(pin, realSalt);
        showLoading(false);
        if (!hash || pinHash !== hash) {
            toast.error(!hash ? 'Failed to generate hash' : 'Invalid PIN');
            openPin();
            return;
        }
        setPinAuthenticated(true);
    };

    return <div className="grid min-h-dvh place-items-center bg-base-200"></div>;
};

export default PinPage;
