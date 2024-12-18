import { FC, useEffect, useMemo } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import ReportPage from './report-page';
import CashFlowReportPage from './cash-flow-report-page';
import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { Icon } from '@/components/icon';
import { openModal } from '@/stores/modal';
import ModalSelectReport from './components/modal-select-report';
import { LabelValue } from '@/types/common';
import AssetsFlowReportPage from './assets-flow-report-page';

interface LayoutReportProps {}

export const LayoutReport: FC<LayoutReportProps> = () => {
    const [, setAppBar] = useAtom(appBarCtxAtom);

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const reports = useMemo<LabelValue<string>[]>(() => {
        return [
            {
                value: '/report',
                label: 'Expense Overview',
            },
            {
                value: '/report/cash-flow',
                label: 'Cash Flow',
            },
            {
                value: '/report/assets-flow',
                label: 'Assets Flow',
            },
        ];
    }, []);

    const selectedReport = useMemo(() => {
        return reports.find((el) => pathname === el.value);
    }, [reports, pathname]);

    useEffect(() => {
        setAppBar({
            title: selectedReport?.label ?? 'Report',
            revealer: true,
            actions: [
                <button
                    onClick={() =>
                        openModal(ModalSelectReport, {
                            reports,
                            onClose: (link) => link && navigate(link),
                        })
                    }
                    className="ml-2 text-2xl"
                >
                    <Icon icon="lucide:menu" />
                </button>,
            ],
        });
    }, [selectedReport]);

    return (
        <Routes>
            <Route path="/" element={<ReportPage />} />
            <Route path="/cash-flow" element={<CashFlowReportPage />} />
            <Route path="/assets-flow" element={<AssetsFlowReportPage />} />
        </Routes>
    );
};
