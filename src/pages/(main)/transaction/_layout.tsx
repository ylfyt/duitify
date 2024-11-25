import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import TransactionPage from './transaction-page';
import TransactionCreatePage from './transaction-create-page';
import { Transaction } from '@/types/transaction.type';
import { atom } from 'jotai';

export const focusedTransactionAtom = atom<Transaction | undefined>();

interface LayoutTransactionProps {}

export const LayoutTransaction: FC<LayoutTransactionProps> = () => {
    return (
        <Routes>
            <Route path="/" element={<TransactionPage />} />
            <Route path="/create" element={<TransactionCreatePage />} />
        </Routes>
    );
};
