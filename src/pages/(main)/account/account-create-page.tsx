import { FC } from 'react';
import { LoadingButton } from '@/components/loading-button';
import { ACCOUNT_LOGO_BASE } from '@/constants/logo';
import { AccountRepo } from '@/repo/account-repo';
import { QueryResultOne } from '@/repo/base-repo';
import { useAccountImageAtom } from '@/stores/account-image';
import { sessionAtom } from '@/stores/auth';
import { Account } from '@/types/account.type';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccountAtom } from '@/stores/account';
import { useNavigate, useParams } from 'react-router-dom';
import { appBarCtxAtom, showLoading } from '@/stores/common';
import { Tooltip } from '@/components/tooltip';
import { formatCurrency } from '@/helper/format-currency';

interface AccountCreatePageProps {}

const AccountCreatePage: FC<AccountCreatePageProps> = ({}) => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);
    const [user] = useAtom(sessionAtom);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { setData: setAccounts, fetched: accountsFetched } = useAccountAtom();
    const { data: accountImages, refresh, loading: loadingAccountImages, fetched } = useAccountImageAtom();

    const [account, setAccount] = useState<Account>();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [selectedLogo, setSelectedLogo] = useState(0);

    const disabled = useMemo(() => !name || !balance || isNaN(parseFloat(balance)), [name, balance]);

    useEffect(() => {
        setAppBarCtx({ title: id ? 'Update Account' : 'Create Account', back: true });

        if (fetched) return;
        (async () => {
            const msg = await refresh();
            if (msg) return toast.error(msg);
        })();
    }, []);

    useEffect(() => {
        if (!id) return;
        (async () => {
            showLoading(true);
            const { data, error } = await AccountRepo.getAccount(id);
            showLoading(false);
            if (data) return setAccount(data);

            toast.error(!data || !error ? 'Account not found' : error.message);
            navigate('/accounts', { replace: true });
        })();
    }, []);

    useEffect(() => {
        if (!fetched) return;
        setSelectedLogo(account?.logo ? accountImages.indexOf(account.logo) : 0);
    }, [fetched, account, accountImages]);

    useEffect(() => {
        if (!account) return;
        setName(account.name);
        setBalance(account.initial_balance.toString());
    }, [account]);

    const submit = async () => {
        setLoading(true);
        let res: QueryResultOne<Account>;
        if (id && account) {
            res = await AccountRepo.updateAccount(id, {
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
        if (res.error || !res.data) {
            toast.error(!res.data || !res.error ? 'Something went wrong' : res.error.message);
            return;
        }
        if (accountsFetched)
            setAccounts((prev) => (id ? prev.map((el) => (el.id === id ? res.data! : el)) : [res.data!, ...prev]));

        navigate('/accounts', { replace: true });
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-2">
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
                        <span className="req dai-label-text">Initial Balance</span>
                    </div>
                    <Tooltip
                        open={!!balance}
                        text={formatCurrency(isNaN(parseFloat(balance)) ? 0 : parseFloat(balance))}
                    >
                        {(ref) => (
                            <input
                                ref={ref}
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                type="number"
                                placeholder="Initial Balance"
                                className="dai-input dai-input-bordered"
                            />
                        )}
                    </Tooltip>
                </label>
                <div className="dai-form-control">
                    <div className="dai-label">
                        <span className="req dai-label-text">Logo</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {loadingAccountImages ? (
                            Array.from({ length: 10 }).map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="flex-shrink-0 rounded-xl border-4 border-transparent outline outline-4 outline-transparent"
                                >
                                    <div className="dai-skeleton size-12 rounded-lg" />
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
                </div>
                <div className="flex justify-end pt-2">
                    <LoadingButton
                        size="sm"
                        disabled={disabled}
                        loading={loading}
                        type="submit"
                        className="dai-btn-primary"
                    >
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </div>
    );
};

export default AccountCreatePage;
