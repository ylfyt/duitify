import { formatCurrency } from '@/helper/format-currency';
import { revealAmountAtom, settingsAtom } from '@/stores/settings';
import { useAtom } from 'jotai';
import { FC, useMemo } from 'react';

interface AmountRevealerProps {
    amount: number;
}

export const AmountRevealer: FC<AmountRevealerProps> = ({ amount }) => {
    const [settings] = useAtom(settingsAtom);
    const [reveal] = useAtom(revealAmountAtom);

    const absAmount = useMemo(() => Math.abs(amount), [amount]);

    if (!settings?.hide_amount || reveal || absAmount <= (settings.max_visible_amount ?? 0))
        return formatCurrency(amount);

    if (absAmount >= 10_000) return '***********';
    return '*********';
};
