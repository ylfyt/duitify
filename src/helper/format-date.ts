const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

type Options = {
    placeholder?: string;
    lang?: string;
    format?: string;
    timeZone?: string;
};

/**
 * Example format: 'yyyy-MM-dd HH:mm:ss'
 *
 * Example lang: 'en-US', 'id-ID'
 */
export function formatDate(
    date: Date | string | number | undefined | null,
    { placeholder = '-', lang, format = 'yyyy-MM-dd', timeZone }: Options = {},
): string {
    if (!date) return placeholder;
    if (typeof date === 'string') date = new Date(date);
    if (typeof date === 'number') date = new Date(date);
    if (date instanceof Date === false) return placeholder;

    if (!timeZone) timeZone = LOCAL_TIMEZONE;
    if (lang) {
        const formatter = new Intl.DateTimeFormat(lang, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            weekday: 'short',
            timeZone,
        });
        return formatter.format(date);
    }

    if (timeZone !== LOCAL_TIMEZONE) date = new Date(date.toLocaleString('en-US', { timeZone }));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return format
        .replace('yyyy', year.toString())
        .replace('MM', month.toString().padStart(2, '0'))
        .replace('dd', day.toString().padStart(2, '0'))
        .replace('HH', hour.toString().padStart(2, '0'))
        .replace('mm', minute.toString().padStart(2, '0'))
        .replace('ss', second.toString().padStart(2, '0'));
}
