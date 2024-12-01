import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import ReportPage from './report-page';
import CashFlowReportPage from './cash-flow-report-page';

interface LayoutReportProps {}

export const LayoutReport: FC<LayoutReportProps> = () => {
    return (
        <Routes>
            <Route path="/" element={<ReportPage />} />
            <Route path="/cash-flow" element={<CashFlowReportPage />} />
        </Routes>
    );
};
