export async function sha256(input: string, salt: string): Promise<string> {
    // Combine the input with the salt
    const saltedInput = salt + input;

    // Encode the salted input as UTF-8
    const encoder = new TextEncoder();
    const data = encoder.encode(saltedInput);

    // Hash the data using SHA-256
    try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        // Convert the hash buffer to a hex string
        return Array.from(new Uint8Array(hashBuffer))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    } catch (error) {
        return '';
    }
}

export function generateSalt(length: number = 16): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}
