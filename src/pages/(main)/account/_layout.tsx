import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import AccountPage from './account-page';
import TransactionPage from '../transaction/transaction-page';
import AccountCreatePage from './account-create-page';

interface LayoutTransactionProps {}

export const LayoutAccount: FC<LayoutTransactionProps> = () => {
    return (
        <Routes>
            <Route path="/" element={<AccountPage />} />
            <Route path="/transaction" element={<TransactionPage />} />
            <Route path="/new" element={<AccountCreatePage />} />
            <Route path="/:id" element={<AccountCreatePage />} />
        </Routes>
    );
};
