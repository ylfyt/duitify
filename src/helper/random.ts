/**
 * Get a random number between min and max (inclusive).
 */
export function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
