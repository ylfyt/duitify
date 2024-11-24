import { LoadingButton } from '@/components/loading-button';
import { Modal } from '@/components/modal';
import { ENV } from '@/constants/env';
import { ACCOUNT_LOGOS } from '@/constants/logo';
import { AccountRepo } from '@/repo/account-repo';
import { QueryResultOne } from '@/repo/base-repo';
import { closeModal } from '@/stores/modal';
import { Account } from '@/types/account.type';
import { FC, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface ModalAccountCreateProps {
    onSuccess: (account: Account) => void;
    account?: Account;
}

export const ModalAccountCreate: FC<ModalAccountCreateProps> = ({ onSuccess, account }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(account?.name ?? '');
    const [balance, setBalance] = useState(account?.initial_balance?.toString() ?? '');
    const [selectedLogo, setSelectedLogo] = useState(account?.logo ? ACCOUNT_LOGOS.indexOf(account.logo) : 0);

    const disabled = useMemo(() => !name || !balance || isNaN(parseFloat(balance)), [name, balance]);

    const submit = async () => {
        setLoading(true);
        let res: QueryResultOne<Account>;
        if (account) {
            res = await AccountRepo.updateAccount(account.id, {
                name,
                initial_balance: parseFloat(balance),
                logo: ACCOUNT_LOGOS[selectedLogo],
            });

            if (res.data) res.data.balance += parseFloat(balance) - account.initial_balance;
        } else {
            res = await AccountRepo.createAccount({
                name,
                initial_balance: parseFloat(balance),
                logo: ACCOUNT_LOGOS[selectedLogo],
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
        toast.success(`Account ${account ? 'updated' : 'created'} successfully`);
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
                        {ACCOUNT_LOGOS.map((el, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedLogo(idx)}
                                type="button"
                                className={
                                    'flex-shrink-0 rounded-xl border-4 border-transparent outline outline-4 ' +
                                    (idx === selectedLogo ? 'outline-primary' : 'outline-transparent')
                                }
                            >
                                <img className="size-12 rounded-lg" key={idx} src={ENV.BASE_URL + el} alt="" />
                            </button>
                        ))}
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
