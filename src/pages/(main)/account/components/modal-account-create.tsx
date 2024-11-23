import { LoadingButton } from '@/components/loading-button';
import { Modal } from '@/components/modal';
import { AccountLogo as ACCOUNT_LOGOS } from '@/constants/logo';
import { AccountRepo } from '@/repo/account-repo';
import { closeModal } from '@/stores/modal';
import { Account } from '@/types/account.type';
import { FC, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface ModalAccountCreateProps {
    onSuccess: (account: Account) => void;
}

export const ModalAccountCreate: FC<ModalAccountCreateProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [selectedLogo, setSelectedLogo] = useState(0);

    const disabled = useMemo(() => !name || !balance || isNaN(parseFloat(balance)), [name, balance]);

    const submit = async () => {
        setLoading(true);
        const { error, data } = await AccountRepo.createAccount({
            name,
            initial_balance: parseFloat(balance),
            logo: ACCOUNT_LOGOS[selectedLogo],
        });
        setLoading(false);
        if (error) {
            toast.error(error.message);
            return;
        }
        if (!data) {
            toast.error('Something went wrong');
            return;
        }
        data.balance = data.initial_balance;
        toast.success('Account created successfully');
        onSuccess(data);
        closeModal();
    };

    return (
        <Modal title="Create Account" className="w-[90vw] max-w-[30rem]">
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
                    <div className="flex items-center gap-2 overflow-x-scroll py-2">
                        {ACCOUNT_LOGOS.map((el, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedLogo(idx)}
                                type="button"
                                className={
                                    'flex-shrink-0 rounded-xl p-2 ' +
                                    (idx === selectedLogo ? 'bg-primary' : 'bg-base-300')
                                }
                            >
                                <img className="size-12 rounded-lg" key={idx} src={el} alt="" />
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
