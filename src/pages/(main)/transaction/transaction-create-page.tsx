import { LoadingButton } from '@/components/loading-button';
import { TransactionRepo } from '@/repo/transaction-repo';
import { useAccountAtom } from '@/stores/account';
import { useCategoryAtom } from '@/stores/category';
import { appBarCtxAtom, showLoading } from '@/stores/common';
import { LabelValue } from '@/types/common';
import { Transaction, TransactionType } from '@/types/transaction.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { focusedTransactionAtom } from './_layout';
import { formatDate } from '@/helper/format-date';
import { QueryResultOne } from '@/repo/base-repo';
import { sessionAtom } from '@/stores/auth';
import { Tooltip } from '@/components/tooltip';
import { formatCurrency } from '@/helper/format-currency';
import { Icon } from '@/components/icon';
import { showConfirm } from '@/stores/confirm';

interface TransactionCreatePageProps {}

const TransactionCreatePage: FC<TransactionCreatePageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);
    const [session] = useAtom(sessionAtom);
    const navigate = useNavigate();

    const [search] = useSearchParams();

    const { setData: setAccounts } = useAccountAtom();
    const [focusedTransaction, setFocusedTransaction] = useAtom(focusedTransactionAtom);

    const { fetched: fetchedAccounts, refresh: refreshAccounts, data: accounts } = useAccountAtom();

    const { fetched: fetchedCategories, refresh: refreshCategories, data: categories } = useCategoryAtom();

    const [selectedType, setSelectedType] = useState<TransactionType>(focusedTransaction?.type ?? 'expense');
    const [amount, setAmount] = useState(focusedTransaction?.amount.toString() ?? '');
    const [description, setDescription] = useState(focusedTransaction?.description ?? '');
    const [occurredAt, setOccurredAt] = useState(
        formatDate(focusedTransaction?.occurred_at ?? new Date(), { format: 'yyyy-MM-dd HH:mm' }),
    );

    const [category, setCategory] = useState<string>(focusedTransaction?.category?.id ?? '');
    const [fromAccount, setFromAccount] = useState<string | undefined>(
        focusedTransaction?.account?.id || search.get('account') || '',
    );
    const [targetAccount, setTargetAccount] = useState<string | undefined>(focusedTransaction?.to_account?.id ?? '');

    const [loading, setLoading] = useState(false);

    const disabled = useMemo(
        () =>
            !amount ||
            !fromAccount ||
            isNaN(parseFloat(amount)) ||
            (selectedType === 'transfer' && !targetAccount) ||
            (selectedType !== 'transfer' && !category) ||
            (selectedType !== 'transfer' && categories.find((el) => el.id === category)?.type !== selectedType),
        [amount, fromAccount, category, targetAccount, selectedType, categories],
    );

    const accountOptions = useMemo<LabelValue<string>[]>(
        () => accounts.map((el) => ({ label: el.name, value: el.id })),
        [accounts],
    );
    const categoryOptions = useMemo<LabelValue<string>[]>(
        () => categories.filter((el) => el.type === selectedType).map((el) => ({ label: el.name, value: el.id })),
        [categories, selectedType],
    );

    useEffect(() => {
        setAppBarCtx({
            title: focusedTransaction ? 'Edit Transaction' : 'Create Transaction',
            back: true,
            actions: focusedTransaction && [
                <button onClick={handleDelete} className="dai-btn dai-btn-error dai-btn-xs">
                    <Icon icon="lucide:trash" />
                </button>,
            ],
        });
        return () => {
            setFocusedTransaction(undefined);
        };
    }, [focusedTransaction]);

    useEffect(() => {
        if (fetchedAccounts) return;
        (async () => {
            const msg = await refreshAccounts();
            if (msg) toast.error(msg);
        })();
    }, []);
    useEffect(() => {
        if (fetchedCategories) return;
        (async () => {
            const msg = await refreshCategories();
            if (msg) toast.error(msg);
        })();
    }, []);

    const handleDelete = async () => {
        if (!focusedTransaction) return;
        const confirmed = await showConfirm({
            title: 'Delete transaction',
            body: 'Are you sure you want to delete this transaction?',
        });
        if (!confirmed) return;

        showLoading(true);
        const { error } = await TransactionRepo.delete(focusedTransaction.id);
        showLoading(false);
        if (error) {
            toast.error(error.message);
            return;
        }
        setAccounts((prev) => {
            const account = prev.find((el2) => el2.id === focusedTransaction.account_id);
            if (!account) return prev;
            if (focusedTransaction.type === 'expense' || focusedTransaction.type === 'transfer') {
                account.balance += focusedTransaction.amount;
            }
            if (focusedTransaction.type === 'income') {
                account.balance -= focusedTransaction.amount;
            }
            if (focusedTransaction.type === 'transfer') {
                const toAccount = prev.find((el2) => el2.id === focusedTransaction.to_account_id);
                if (!toAccount) return prev;
                toAccount.balance -= focusedTransaction.amount;
            }
            return [...prev];
        });
        navigate(-1);
    };

    const submit = async () => {
        setLoading(true);
        let res: QueryResultOne<Transaction>;
        if (focusedTransaction) {
            res = await TransactionRepo.update(focusedTransaction.id, {
                type: selectedType,
                occurred_at: formatDate(occurredAt, { format: 'yyyy-MM-dd HH:mm', timeZone: 'UTC' }),
                description: description,
                amount: parseFloat(amount),
                account_id: fromAccount!,
                category_id: !category ? null : category,
                to_account_id: !targetAccount ? null : targetAccount,
            });
        } else {
            res = await TransactionRepo.create({
                type: selectedType,
                occurred_at: formatDate(occurredAt, { format: 'yyyy-MM-dd HH:mm', timeZone: 'UTC' }),
                description: description,
                amount: parseFloat(amount),
                account_id: fromAccount!,
                category_id: !category ? null : category,
                to_account_id: !targetAccount ? null : targetAccount,
                user_id: session!.user.id,
            });
        }
        setLoading(false);
        if (res.error) {
            toast.error(res.error.message);
            return;
        }
        setAccounts((prev) => {
            const account = prev.find((el) => el.id === fromAccount);
            if (!account) return prev;

            if (focusedTransaction) {
                if (parseFloat(amount) === focusedTransaction.amount) return prev;
                if (selectedType === 'expense' || selectedType === 'transfer') {
                    account.balance -= parseFloat(amount) - focusedTransaction.amount;
                }
                if (selectedType === 'income') {
                    account.balance += parseFloat(amount) - focusedTransaction.amount;
                }
                if (selectedType === 'transfer') {
                    const toAccount = prev.find((el) => el.id === targetAccount);
                    if (!toAccount) return prev;
                    toAccount.balance += parseFloat(amount) - focusedTransaction.amount;
                }
                return [...prev];
            }
            if (selectedType === 'expense' || selectedType === 'transfer') {
                account.balance -= parseFloat(amount);
            }
            if (selectedType === 'income') {
                account.balance += parseFloat(amount);
            }
            if (selectedType === 'transfer') {
                const toAccount = prev.find((el) => el.id === targetAccount);
                if (!toAccount) return prev;
                toAccount.balance += parseFloat(amount);
            }
            return [...prev];
        });
        navigate(-1);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-2">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}
                className="grid grid-cols-2 gap-2"
            >
                <div role="tablist" className="dai-tabs-boxed dai-tabs col-span-full bg-base-100">
                    {(['expense', 'income', 'transfer'] as TransactionType[]).map((el, idx) => (
                        <button
                            key={idx}
                            type="button"
                            role="tab"
                            disabled={!!focusedTransaction && el !== focusedTransaction.type}
                            onClick={() => {
                                setCategory('');
                                setSelectedType(el);
                            }}
                            className={'dai-tab capitalize ' + (el === selectedType ? 'dai-tab-active' : '')}
                        >
                            {el}
                        </button>
                    ))}
                </div>
                <label className="dai-form-control">
                    <div className="dai-label">
                        <span className="req dai-label-text">Amount</span>
                    </div>
                    <Tooltip open={!!amount} text={formatCurrency(isNaN(parseFloat(amount)) ? 0 : parseFloat(amount))}>
                        {(ref) => (
                            <input
                                ref={ref}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                placeholder="Amount"
                                className="dai-input dai-input-bordered"
                            />
                        )}
                    </Tooltip>
                </label>
                <label className="dai-form-control">
                    <div className="dai-label">
                        <span className="req dai-label-text">Date</span>
                    </div>
                    <input
                        value={occurredAt}
                        onChange={(e) => setOccurredAt(e.target.value)}
                        type="datetime-local"
                        placeholder="Date"
                        className="dai-input dai-input-bordered w-full"
                    />
                </label>
                <label className="dai-form-control">
                    <div className="dai-label">
                        <span className="req dai-label-text">Account</span>
                    </div>
                    <select
                        value={fromAccount}
                        disabled={
                            !!focusedTransaction ||
                            (!!search.get('account') &&
                                selectedType !== 'transfer' &&
                                fromAccount === search.get('account'))
                        }
                        onChange={(e) => setFromAccount(e.target.value)}
                        className={
                            'dai-select dai-select-bordered w-full ' + (!fromAccount ? 'text-base-content/40' : '')
                        }
                    >
                        <option value="">Select account</option>
                        {accountOptions.map((el, idx) => (
                            <option key={idx} value={el.value}>
                                {el.label}
                            </option>
                        ))}
                    </select>
                </label>
                {selectedType === 'transfer' && (
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="req dai-label-text">To Account</span>
                        </div>
                        <select
                            value={targetAccount}
                            disabled={!!focusedTransaction}
                            onChange={(e) => setTargetAccount(e.target.value)}
                            className={
                                'dai-select dai-select-bordered w-full ' +
                                (!targetAccount ? 'text-base-content/40' : '')
                            }
                        >
                            <option value="">Select account</option>
                            {accountOptions.map((el, idx) => (
                                <option key={idx} value={el.value}>
                                    {el.label}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                {selectedType !== 'transfer' && (
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="req dai-label-text">Category</span>
                        </div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={
                                'dai-select dai-select-bordered w-full ' + (!category ? 'text-base-content/40' : '')
                            }
                        >
                            <option value="">Select category</option>
                            {categoryOptions.map((el, idx) => (
                                <option key={idx} value={el.value}>
                                    {el.label}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                <label className="dai-form-control col-span-full">
                    <div className="dai-label">
                        <span className="dai-label-text">Description</span>
                    </div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="dai-textarea dai-textarea-bordered h-24"
                        placeholder="Description"
                    ></textarea>
                </label>
                <div className="col-span-full flex justify-end pt-4">
                    <LoadingButton size='sm' disabled={disabled} loading={loading} className="dai-btn-primary">
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </div>
    );
};

export default TransactionCreatePage;
