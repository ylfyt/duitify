import { useStateWithRef } from '@/hooks/use-state-with-ref';
import { closeModal } from '@/stores/modal';
import { ClipboardEvent, FC, KeyboardEvent, useEffect, useMemo, useRef } from 'react';

interface ModalPinProps {
    onClose: (pin: string) => void;
}

const ModalPin: FC<ModalPinProps> = ({ onClose }) => {
    const pinLength = useMemo(() => 6, []);
    const ref = useRef<HTMLInputElement[]>([]);
    const [values, setValues, valuesRef] = useStateWithRef<string[]>([]);

    const disabled = useMemo(
        () => values.length < pinLength || values.findIndex((el) => !el) !== -1,
        [values, pinLength],
    );

    useEffect(() => {
        ref.current[0]?.focus();
    }, [ref.current]);

    useEffect(() => {
        return () => onClose(valuesRef.current.join(''));
    }, []);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (
            !/^[0-9]{1}$/.test(e.key) &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            e.key !== 'Tab' &&
            !e.metaKey &&
            e.key !== 'Enter' &&
            !((e.key === 'v' || e.key === 'V') && e.ctrlKey)
        ) {
            e.preventDefault();
        }

        if (e.key === 'Delete' || e.key === 'Backspace') {
            const inputs = ref.current;
            if (idx > 0) setTimeout(() => inputs[idx - 1].focus());
        }
    };

    const handleInput = (idx: number) => {
        const target = ref.current[idx];
        if (!target.value || idx >= ref.current.length - 1) return;
        ref.current[idx + 1].focus();
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData?.getData('text') ?? '';
        if (!new RegExp(`^[0-9]{${ref.current.length}}$`).test(text)) {
            return;
        }
        const digits = text.split('');
        setValues(digits);
        ref.current[ref.current.length - 1].focus();
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                closeModal();
            }}
            className="flex flex-col items-center gap-8 rounded-xl border border-base-300 bg-base-100 px-8 py-12 shadow-md"
        >
            <header className="text-center">
                <h1 className="text-2xl font-bold">PIN Verification</h1>
                <p className="text-sm text-base-content/50">Enter the {pinLength}-digit PIN code.</p>
            </header>
            <div className="flex items-center justify-center gap-3">
                {Array.from({ length: pinLength }).map((_, idx) => (
                    <input
                        key={idx}
                        type="password"
                        inputMode="numeric"
                        value={values[idx] ?? ''}
                        onChange={(e) =>
                            setValues((prev) => {
                                prev[idx] = e.target.value;
                                return [...prev];
                            })
                        }
                        ref={(el) => (ref.current[idx] = el!)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onInput={() => handleInput(idx)}
                        onFocus={(e) => e.target.select()}
                        onPaste={(e) => handlePaste(e)}
                        className="dai-input dai-input-bordered size-9 p-1 text-center text-lg font-medium sm:size-14 sm:text-2xl"
                        pattern="\d*"
                        maxLength={1}
                    />
                ))}
            </div>
            <button
                type="submit"
                disabled={disabled}
                className="dai-btn dai-btn-primary dai-btn-sm dai-btn-wide sm:dai-btn-md"
            >
                Submit
            </button>
        </form>
    );
};

export default ModalPin;
