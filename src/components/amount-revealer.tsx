import { formatCurrency } from '@/helper/format-currency';
import { revealAmountAtom, settingsAtom } from '@/stores/settings';
import { useAtom } from 'jotai';
import { FC, useMemo } from 'react';

interface AmountRevealerProps {
    amount: number;
    count?: number;
}

export const AmountRevealer: FC<AmountRevealerProps> = ({ amount, count }) => {
    const [settings] = useAtom(settingsAtom);
    const [reveal] = useAtom(revealAmountAtom);

    const absAmount = useMemo(() => Math.abs(amount), [amount]);

    if (!settings?.hide_amount || reveal || absAmount <= (settings.max_visible_amount ?? 0))
        return formatCurrency(amount);

    if (count) return <Dots num={count} />;
    if (absAmount >= 1_000_000) return <Dots num={9} />;
    return <Dots num={7} />;
};

interface DotsProps {
    num: number;
}

const Dots: FC<DotsProps> = ({ num }) => {
    return (
        <div className="flex items-center">
            <div className="flex items-center gap-1">
                {Array.from({ length: num }).map((_, idx) => (
                    <span key={idx} className="size-2 rounded-full bg-current"></span>
                ))}
            </div>
            <p className="invisible w-[0px]">r</p>
        </div>
    );
};
