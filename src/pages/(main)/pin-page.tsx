import { ClipboardEvent, FC, KeyboardEvent, useEffect, useMemo, useRef } from 'react';

interface PinPageProps {}

const PinPage: FC<PinPageProps> = () => {
    const pinLength = useMemo(() => 6, []);
    const ref = useRef<HTMLInputElement[]>([]);
    const submitRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        ref.current[0]?.focus();
    }, [ref.current]);

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
        ref.current.forEach((el, idx) => {
            el.value = digits[idx] ?? '';
        });
        ref.current[ref.current.length - 1].focus();
    };

    const submit = async () => {
        const values = ref.current.map((el) => el.value);
        if (values.findIndex((el) => !el) !== -1) return;

        console.log(values.join(''));
    };

    return (
        <div className="grid min-h-dvh place-items-center bg-base-200">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}
                className="flex flex-col items-center gap-6 rounded-xl border border-base-300 bg-base-100 px-8 py-12 shadow-md"
            >
                <header className="text-center">
                    <h1 className="text-2xl font-bold">PIN Verification</h1>
                    <p className="text-sm text-base-content/50">Enter the {pinLength}-digit PIN code.</p>
                </header>
                <div className="flex items-center justify-center gap-3">
                    {Array.from({ length: pinLength }).map((_, idx) => (
                        <input
                            key={idx}
                            type="text"
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
                    ref={submitRef}
                    type="submit"
                    className="dai-btn dai-btn-primary dai-btn-sm dai-btn-wide sm:dai-btn-md"
                >
                    Verify Account
                </button>
            </form>
        </div>
    );
};

export default PinPage;
