import { FC, useEffect, useMemo } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ReportPage from './report-page';
import CashFlowReportPage from './cash-flow-report-page';
import { appBarCtxAtom } from '@/stores/common';
import { useAtom } from 'jotai';
import { Icon } from '@/components/icon';
import { openModal } from '@/stores/modal';
import ModalSelectReport from './components/modal-select-report';
import { LabelValue } from '@/types/common';

interface LayoutReportProps {}

export const LayoutReport: FC<LayoutReportProps> = () => {
    const [, setAppBar] = useAtom(appBarCtxAtom);

    const navigate = useNavigate();

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
        ];
    }, []);

    useEffect(() => {
        setAppBar({
            title: 'Report',
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
    }, []);

    return (
        <Routes>
            <Route path="/" element={<ReportPage />} />
            <Route path="/cash-flow" element={<CashFlowReportPage />} />
        </Routes>
    );
};
