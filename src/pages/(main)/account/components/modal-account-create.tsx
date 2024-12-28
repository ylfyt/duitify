import { LoadingButton } from '@/components/loading-button';
import { Modal } from '@/components/modal';
import { ACCOUNT_LOGO_BASE } from '@/constants/logo';
import { AccountRepo } from '@/repo/account-repo';
import { QueryResultOne } from '@/repo/base-repo';
import { useAccountImageAtom } from '@/stores/account-image';
import { sessionAtom } from '@/stores/auth';
import { closeModal } from '@/stores/modal';
import { Account } from '@/types/account.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface ModalAccountCreateProps {
    onSuccess: (account: Account) => void;
    account?: Account;
}

export const ModalAccountCreate: FC<ModalAccountCreateProps> = ({ onSuccess, account }) => {
    const [user] = useAtom(sessionAtom);

    const { data: accountImages, refresh, loading: loadingAccountImages, fetched } = useAccountImageAtom();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(account?.name ?? '');
    const [balance, setBalance] = useState(account?.initial_balance?.toString() ?? '');
    const [selectedLogo, setSelectedLogo] = useState(0);

    const disabled = useMemo(() => !name || !balance || isNaN(parseFloat(balance)), [name, balance]);

    useEffect(() => {
        if (fetched) return;
        (async () => {
            const msg = await refresh();
            if (msg) return toast.error(msg);
        })();
    }, []);

    useEffect(() => {
        if (!fetched) return;
        setSelectedLogo(account?.logo ? accountImages.indexOf(account.logo) : 0);
    }, [fetched, account, accountImages]);

    const submit = async () => {
        setLoading(true);
        let res: QueryResultOne<Account>;
        if (account) {
            res = await AccountRepo.updateAccount(account.id, {
                name,
                initial_balance: parseFloat(balance),
                logo: accountImages[selectedLogo],
            });

            if (res.data) res.data.balance += parseFloat(balance) - account.initial_balance;
        } else {
            res = await AccountRepo.createAccount({
                name,
                initial_balance: parseFloat(balance),
                logo: accountImages[selectedLogo],
                user_id: user!.user.id,
            });
            if (res.data) res.data.balance = parseFloat(balance);
        }
        setLoading(false);
        if (res.error) {
            toast.error(res.error.message);
            return;
        }
        if (!res.data) {
            toast.error('Something went wrong');
            return;
        }
        onSuccess(res.data);
        closeModal();
    };

    return (
        <Modal title={account ? 'Update Account' : 'Create Account'} className="w-[90vw] max-w-[30rem]">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}
                className="grid grid-cols-1 gap-2"
            >
                <label className="dai-form-control w-full">
                    <div className="dai-label">
                        <span className="req dai-label-text">Name</span>
                    </div>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Account Name"
                        className="dai-input dai-input-bordered"
                    />
                </label>
                <label className="dai-form-control">
                    <div className="dai-label">
                        <span className="req dai-label-text">Intial Balance</span>
                    </div>
                    <input
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        type="number"
                        placeholder="Intial Balance"
                        className="dai-input dai-input-bordered"
                    />
                </label>
                <label className="dai-form-control">
                    <div className="dai-label">
                        <span className="req dai-label-text">Logo</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-scroll px-2 py-2">
                        {loadingAccountImages ? (
                            Array.from({ length: 10 }).map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="flex-shrink-0 rounded-xl border-4 border-transparent outline outline-4 outline-transparent"
                                >
                                    <img className="dai-skeleton size-12 rounded-lg" alt="" />
                                </button>
                            ))
                        ) : accountImages.length === 0 ? (
                            <div></div>
                        ) : (
                            accountImages.map((el, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedLogo(idx)}
                                    type="button"
                                    className={
                                        'flex-shrink-0 rounded-xl border-4 border-transparent outline outline-4 ' +
                                        (idx === selectedLogo ? 'outline-primary' : 'outline-transparent')
                                    }
                                >
                                    <img
                                        className="size-12 rounded-lg"
                                        key={idx}
                                        src={ACCOUNT_LOGO_BASE + '/' + el}
                                        alt=""
                                    />
                                </button>
                            ))
                        )}
                    </div>
                </label>
                <div className="flex justify-end pt-2">
                    <LoadingButton disabled={disabled} loading={loading} type="submit" className="dai-btn-primary">
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </Modal>
    );
};
