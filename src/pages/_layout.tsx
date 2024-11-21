import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './login-page';
import { RegisterPage } from './register-page';
import { DashboardLayout } from './(main)/_layout';

interface MainLayoutProps {}

const MainLayout: FC<MainLayoutProps> = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<DashboardLayout />} />
        </Routes>
    );
};

export default MainLayout;
