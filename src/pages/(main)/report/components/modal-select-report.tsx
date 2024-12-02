import { Modal } from '@/components/modal';
import { closeModal } from '@/stores/modal';
import { LabelValue } from '@/types/common';
import { FC, useEffect, useRef } from 'react';

interface ModalSelectReportProps {
    onClose: (link?: string) => void;
    reports: LabelValue<string>[];
}

const ModalSelectReport: FC<ModalSelectReportProps> = ({ onClose, reports }) => {
    const selectedRef = useRef<string>();

    useEffect(() => {
        return () => onClose(selectedRef.current);
    }, []);

    const onClick = (link: string) => {
        selectedRef.current = link;
        closeModal();
    };

    return (
        <Modal title="Select Report">
            <div className="mt-4 flex flex-col items-center gap-2">
                {reports.map((el) => (
                    <button
                        key={el.value}
                        onClick={() => onClick(el.value)}
                        className="dai-btn dai-btn-primary dai-btn-sm dai-btn-wide"
                    >
                        {el.label}
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default ModalSelectReport;
