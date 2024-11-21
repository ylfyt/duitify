export type FormatNumericOpts = {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    hundredBase?: boolean;
};

export function formatNumeric(
    num: number,
    { minimumFractionDigits = 0, maximumFractionDigits = 2 }: FormatNumericOpts = {},
): string {
    return num.toLocaleString('en-US', { minimumFractionDigits, maximumFractionDigits });
}
