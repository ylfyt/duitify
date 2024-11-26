import { LoadingButton } from '@/components/loading-button';
import { SingleSelect } from '@/components/single-select';
import { TransactionRepo } from '@/repo/transaction-repo';
import { useAccountAtom } from '@/stores/account';
import { useCategoryAtom } from '@/stores/category';
import { appBarCtxAtom } from '@/stores/common';
import { LabelValue } from '@/types/common';
import { Transaction, TransactionType } from '@/types/transaction.type';
import { useAtom } from 'jotai';
import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { focusedTransactionAtom } from './_layout';
import { formatDate } from '@/helper/format-date';
import { QueryResultOne } from '@/repo/base-repo';

interface TransactionCreatePageProps {}

const TransactionCreatePage: FC<TransactionCreatePageProps> = () => {
    const [, setAppBarCtx] = useAtom(appBarCtxAtom);
    const navigate = useNavigate();
    const { setData: setAccounts } = useAccountAtom();
    const [focusedTransaction, setFocusedTransaction] = useAtom(focusedTransactionAtom);

    const {
        fetched: fetchedAccounts,
        refresh: refreshAccounts,
        data: accounts,
        loading: loadingAccounts,
    } = useAccountAtom();

    const {
        fetched: fetchedCategories,
        refresh: refreshCategories,
        data: categories,
        loading: loadingCategories,
    } = useCategoryAtom();

    const [selectedType, setSelectedType] = useState<TransactionType>(focusedTransaction?.type ?? 'expense');
    const [amount, setAmount] = useState(focusedTransaction?.amount.toString() ?? '');
    const [description, setDescription] = useState(focusedTransaction?.description ?? '');
    const [occurredAt, setOccurredAt] = useState(
        formatDate(focusedTransaction?.occurred_at ?? new Date(), { format: 'yyyy-MM-ddTHH:mm' }),
    );

    const [selectedAccount, setSelectedAccount] = useState<LabelValue<string> | undefined>(
        focusedTransaction?.account
            ? { label: focusedTransaction.account.name, value: focusedTransaction.account.id }
            : undefined,
    );
    const [selectedCategory, setSelectedCategory] = useState<LabelValue<string> | undefined>(
        focusedTransaction?.category
            ? { label: focusedTransaction.category.name, value: focusedTransaction.category.id }
            : undefined,
    );
    const [selectedToAccount, setSelectedToAccount] = useState<LabelValue<string> | undefined>(
        focusedTransaction?.to_account
            ? { label: focusedTransaction.to_account.name, value: focusedTransaction.to_account.id }
            : undefined,
    );

    const [loading, setLoading] = useState(false);

    const disabled = useMemo(
        () =>
            !amount ||
            !selectedAccount ||
            isNaN(parseFloat(amount)) ||
            (selectedType === 'transfer' && !selectedToAccount) ||
            (selectedType !== 'transfer' && !selectedCategory) ||
            (selectedType !== 'transfer' &&
                categories.find((el) => el.id === selectedCategory?.value)?.type !== selectedType),
        [amount, selectedAccount, selectedCategory, selectedToAccount, selectedType, categories],
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

    const submit = async () => {
        setLoading(true);
        let res: QueryResultOne<Transaction>;
        if (focusedTransaction) {
            res = await TransactionRepo.update(focusedTransaction.id, {
                type: selectedType,
                occurred_at: occurredAt,
                description: description,
                amount: parseFloat(amount),
                account_id: selectedAccount!.value,
                category_id: selectedCategory?.value,
                to_account_id: selectedToAccount?.value,
            });
        } else {
            res = await TransactionRepo.create({
                type: selectedType,
                occurred_at: occurredAt,
                description: description,
                amount: parseFloat(amount),
                account_id: selectedAccount!.value,
                category_id: selectedCategory?.value,
                to_account_id: selectedToAccount?.value,
            });
        }
        setLoading(false);
        if (res.error) {
            toast.error(res.error.message);
            return;
        }
        setAccounts((prev) => {
            const account = prev.find((el) => el.id === selectedAccount?.value);
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
                    const toAccount = prev.find((el) => el.id === selectedToAccount?.value);
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
                const toAccount = prev.find((el) => el.id === selectedToAccount?.value);
                if (!toAccount) return prev;
                toAccount.balance += parseFloat(amount);
            }
            return [...prev];
        });
        navigate(-1);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 pt-4">
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
                            disabled={!!focusedTransaction}
                            onClick={() => setSelectedType(el)}
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
                    <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        placeholder="Amount"
                        className="dai-input dai-input-bordered"
                    />
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
                        <span className="req dai-label-text">Accounts</span>
                    </div>
                    <SingleSelect
                        searchable={false}
                        disabled={!!focusedTransaction}
                        value={selectedAccount}
                        options={accountOptions}
                        loading={loadingAccounts}
                        onChange={setSelectedAccount}
                    />
                </label>
                {selectedType === 'transfer' && (
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="req dai-label-text">To Accounts</span>
                        </div>
                        <SingleSelect
                            searchable={false}
                            disabled={!!focusedTransaction}
                            value={selectedToAccount}
                            options={accountOptions}
                            loading={loadingAccounts}
                            onChange={setSelectedToAccount}
                        />
                    </label>
                )}
                {selectedType !== 'transfer' && (
                    <label className="dai-form-control">
                        <div className="dai-label">
                            <span className="req dai-label-text">Category</span>
                        </div>
                        <SingleSelect
                            searchable={false}
                            value={selectedCategory}
                            options={categoryOptions}
                            loading={loadingCategories}
                            onChange={setSelectedCategory}
                        />
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
                    <LoadingButton disabled={disabled} loading={loading} className="dai-btn-primary">
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </div>
    );
};

export default TransactionCreatePage;
