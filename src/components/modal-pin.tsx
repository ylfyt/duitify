import { useStateWithRef } from '@/hooks/use-state-with-ref';
import { closeModal } from '@/stores/modal';
import { ClipboardEvent, FC, KeyboardEvent, useEffect, useMemo, useRef } from 'react';

interface ModalPinProps {
    onClose: (pin: string, desktopOnly?: boolean) => void;
    desktopOption?: boolean;
}

const ModalPin: FC<ModalPinProps> = ({ onClose, desktopOption }) => {
    const pinLength = useMemo(() => 6, []);
    const ref = useRef<HTMLInputElement[]>([]);
    const [values, setValues, valuesRef] = useStateWithRef<string[]>([]);
    const [desktopOnly, setDesktopOnly, desktopOnlyRef] = useStateWithRef(false);
    const isCancel = useRef(true);

    const disabled = useMemo(
        () => values.length < pinLength || values.findIndex((el) => !el) !== -1,
        [values, pinLength],
    );

    useEffect(() => {
        ref.current[0]?.focus();
    }, [ref.current]);

    useEffect(() => {
        return () => onClose(isCancel.current ? '' : valuesRef.current.join(''), desktopOnlyRef.current);
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
                isCancel.current = false;
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
            <div className="flex w-full flex-col items-center gap-2">
                <button
                    type="submit"
                    disabled={disabled}
                    className="dai-btn dai-btn-primary dai-btn-sm dai-btn-wide sm:dai-btn-md"
                >
                    Submit
                </button>
                {desktopOption && (
                    <label className="dai-label cursor-pointer gap-2">
                        <input
                            type="checkbox"
                            checked={desktopOnly}
                            onChange={(e) => setDesktopOnly(e.target.checked)}
                            className="dai-checkbox-primary dai-checkbox dai-checkbox-sm"
                        />
                        <span className="dai-label-text">Desktop Only</span>
                    </label>
                )}
            </div>
        </form>
    );
};

export default ModalPin;
