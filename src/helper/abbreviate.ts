import { formatNumeric } from './format-numeric';

export function abbreviate(n?: number, max?: 'B' | 'M' | 'K'): string {
    if (n == null) return '-';
    const abs: number = Math.abs(n);

    if (abs > 1_000_000_000_000 && max !== 'B')
        return `${formatNumeric(n / 1_000_000_000_000, { maximumFractionDigits: 2 })} T`;
    if (abs >= 1_000_000_000 && max !== 'M')
        return `${formatNumeric(n / 1_000_000_000, { maximumFractionDigits: 2 })} B`;
    if (abs >= 1_000_000 && max !== 'K') return `${formatNumeric(n / 1_000_000, { maximumFractionDigits: 2 })} M`;
    if (abs >= 1_000) return `${formatNumeric(n / 1_000, { maximumFractionDigits: 2 })} K`;
    return n.toString();
}
