import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import AccountPage from './account-page';
import TransactionPage from '../transaction/transaction-page';

interface LayoutTransactionProps {}

export const LayoutAccount: FC<LayoutTransactionProps> = () => {
    return (
        <Routes>
            <Route path="/" element={<AccountPage />} />
            <Route path="/transaction" element={<TransactionPage />} />
        </Routes>
    );
};
