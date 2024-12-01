export function formatNumberToDate(number: number): string {
    const suffixes: string[] = ['th', 'st', 'nd', 'rd'];
    const remainder: number = number % 100;

    // Check for exceptions like 11th, 12th, and 13th
    const suffix: string = remainder >= 11 && remainder <= 13 ? suffixes[0] : suffixes[number % 10] || suffixes[0];

    return number + suffix;
}
