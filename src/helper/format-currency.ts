export type FormatCurrencyOpts = {
    currency?: string;
};

export function formatCurrency(amount: number, { currency = 'IDR' }: FormatCurrencyOpts = {}): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(amount);
}
