export function removePrefix(str: string, prefix: string): string {
    if (prefix === '') return str;
    if (str.startsWith(prefix)) {
        return str.slice(prefix.length);
    }
    return str;
}

export function removeSuffix(str: string, suffix: string): string {
    if (str.endsWith(suffix)) {
        return str.slice(0, -suffix.length);
    }
    return str;
}
